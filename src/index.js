'use strict';

const HNScraper = require('./scraper');
const logger = require('./utils/logger');
const config = require('./config');

/**
 * Export main components for programmatic use
 */
module.exports = {
  HNScraper,
  logger,
  config,

  /**
   * Quick start function for simple use cases
   * @param {string} searchTerm - Term to search for
   * @param {Object} options - Scraper options
   * @returns {Promise<Array>} Search results
   */
  async search(searchTerm, options = {}) {
    const scraper = new HNScraper({
      ...options,
      searchTerm,
    });

    return await scraper.execute(async (s) => {
      return await s.search(searchTerm);
    });
  },

  /**
   * Scrape a custom URL with a custom extractor function
   * @param {string} url - URL to scrape
   * @param {Function} extractorFn - Function to extract data from page
   * @param {Object} options - Scraper options
   * @returns {Promise<any>} Extracted data
   */
  async scrapeUrl(url, extractorFn, options = {}) {
    const scraper = new HNScraper(options);

    return await scraper.execute(async (s) => {
      return await s.scrapeUrl(url, extractorFn);
    });
  },
};
