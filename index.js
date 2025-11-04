'use strict';

/**
 * HackerNews Scraper - Main Entry Point
 *
 * This file provides a simple example of using the scraper.
 * For production use, use the CLI (src/cli.js) or import from src/index.js
 */

const { HNScraper } = require('./src');

(async () => {
  const scraper = new HNScraper({
    searchTerm: 'lightpanda',
    isCloud: false, // Set to true to use cloud browser
  });

  try {
    const results = await scraper.execute(async (s) => {
      // Perform HackerNews search
      return await s.search('lightpanda');
    });

    console.log('\n=== HackerNews Search Results ===\n');
    console.log(JSON.stringify(results, null, 2));
    console.log(`\nFound ${results.length} results`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();
