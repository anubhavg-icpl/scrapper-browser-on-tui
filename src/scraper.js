'use strict';

const { lightpanda } = require('@lightpanda/browser');
const puppeteer = require('puppeteer-core');
const logger = require('./utils/logger');
const config = require('./config');

/**
 * HackerNews Scraper Class
 */
class HNScraper {
  constructor(options = {}) {
    this.isCloud = options.isCloud || config.isCloud;
    this.searchTerm = options.searchTerm || 'lightpanda';
    this.timeout = options.timeout || config.timeout;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.localProcess = null;
  }

  /**
   * Initialize browser connection
   */
  async initialize() {
    try {
      logger.info('Initializing browser connection...', {
        mode: this.isCloud ? 'cloud' : 'local'
      });

      if (this.isCloud) {
        await this._initializeCloudBrowser();
      } else {
        await this._initializeLocalBrowser();
      }

      this.context = await this.browser.createBrowserContext();
      this.page = await this.context.newPage();

      logger.info('Browser connection established successfully');
    } catch (error) {
      logger.error('Failed to initialize browser', { error: error.message });
      throw error;
    }
  }

  /**
   * Initialize cloud browser connection
   */
  async _initializeCloudBrowser() {
    if (!config.cloudToken) {
      throw new Error('LPD_TOKEN environment variable is required for cloud mode');
    }

    const browserWSEndpoint = `wss://euwest.cloud.lightpanda.io/ws?token=${config.cloudToken}`;

    this.browser = await puppeteer.connect({
      browserWSEndpoint,
    });
  }

  /**
   * Initialize local browser connection
   */
  async _initializeLocalBrowser() {
    const lpdopts = {
      host: config.local.host,
      port: config.local.port,
    };

    const browserWSEndpoint = `ws://${lpdopts.host}:${lpdopts.port}`;

    // Start local Lightpanda browser process
    this.localProcess = await lightpanda.serve(lpdopts);

    // Wait for the browser to be ready (give it a moment to start)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Retry connection with exponential backoff
    let retries = 5;
    let delay = 500;

    while (retries > 0) {
      try {
        this.browser = await puppeteer.connect({
          browserWSEndpoint,
        });
        break;
      } catch (error) {
        retries--;
        if (retries === 0) {
          throw error;
        }
        logger.warn(`Connection failed, retrying... (${retries} attempts left)`, { delay });
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  }

  /**
   * Search HackerNews for a term
   * @param {string} searchTerm - The term to search for
   * @returns {Promise<Array>} Array of search results
   */
  async search(searchTerm = this.searchTerm) {
    try {
      logger.info('Navigating to HackerNews...', { searchTerm });

      // Navigate to HackerNews
      await this.page.goto('https://news.ycombinator.com/', {
        waitUntil: 'networkidle2',
        timeout: this.timeout,
      });

      logger.info('Performing search...');

      // Type search term in the search box
      await this.page.type('input[name="q"]', searchTerm);

      // Press Enter to submit search
      await this.page.keyboard.press('Enter');

      // Wait for search results to load
      await this.page.waitForFunction(
        () => {
          return document.querySelector('.Story_container') != null;
        },
        { timeout: this.timeout }
      );

      logger.info('Extracting search results...');

      // Extract search results
      const results = await this.page.evaluate(() => {
        return Array.from(document.querySelectorAll('.Story_container')).map(row => {
          const titleElement = row.querySelector('.Story_title span');
          const urlElement = row.querySelector('.Story_title a');
          const metaElements = row.querySelectorAll('.Story_meta > span:not(.Story_separator, .Story_comment)');

          return {
            title: titleElement ? titleElement.textContent : 'N/A',
            url: urlElement ? urlElement.getAttribute('href') : 'N/A',
            meta: Array.from(metaElements).map(el => el.textContent),
          };
        });
      });

      logger.info('Search completed successfully', { resultsCount: results.length });

      return results;
    } catch (error) {
      logger.error('Search failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Extract data from a specific URL
   * @param {string} url - The URL to scrape
   * @param {Function} extractorFn - Function to extract data from the page
   * @returns {Promise<any>} Extracted data
   */
  async scrapeUrl(url, extractorFn) {
    try {
      logger.info('Navigating to URL...', { url });

      await this.page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: this.timeout,
      });

      logger.info('Extracting data...');

      const data = await this.page.evaluate(extractorFn);

      logger.info('Data extraction completed successfully');

      return data;
    } catch (error) {
      logger.error('Failed to scrape URL', { url, error: error.message });
      throw error;
    }
  }

  /**
   * Clean up and close browser connection
   */
  async cleanup() {
    try {
      logger.info('Cleaning up browser resources...');

      if (this.page) {
        await this.page.close();
      }

      if (this.context) {
        await this.context.close();
      }

      if (this.browser) {
        await this.browser.disconnect();
      }

      // Stop local process if it was started
      if (this.localProcess) {
        this.localProcess.stdout.destroy();
        this.localProcess.stderr.destroy();
        this.localProcess.kill();
      }

      logger.info('Cleanup completed successfully');
    } catch (error) {
      logger.error('Cleanup failed', { error: error.message });
      throw error;
    }
  }

  /**
   * Execute a complete scraping operation with automatic cleanup
   * @param {Function} operation - Async function to execute
   * @returns {Promise<any>} Operation result
   */
  async execute(operation) {
    try {
      await this.initialize();
      const result = await operation(this);
      return result;
    } finally {
      await this.cleanup();
    }
  }
}

module.exports = HNScraper;
