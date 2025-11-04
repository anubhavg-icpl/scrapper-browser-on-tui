'use strict';

/**
 * Custom Scraper Example
 *
 * This example shows how to scrape a custom URL with a custom extractor
 */

const { HNScraper } = require('../src');

async function main() {
  const scraper = new HNScraper({
    isCloud: false,
  });

  try {
    const results = await scraper.execute(async (s) => {
      // Scrape Wikipedia page
      const links = await s.scrapeUrl(
        'https://en.wikipedia.org/wiki/Web_scraping',
        () => {
          // This function runs in the browser context
          return Array.from(document.querySelectorAll('.reflist a.external')).map(
            (row) => {
              return {
                text: row.textContent,
                href: row.getAttribute('href'),
              };
            }
          );
        }
      );

      return links;
    });

    console.log('Extracted links from Wikipedia:\n');
    console.log(JSON.stringify(results, null, 2));
    console.log(`\nTotal links: ${results.length}`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
