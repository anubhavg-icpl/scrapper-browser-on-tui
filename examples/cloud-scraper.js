'use strict';

/**
 * Cloud Browser Example
 *
 * This example shows how to use Lightpanda cloud browser
 * Make sure to set LPD_TOKEN environment variable
 */

require('dotenv').config();
const { search } = require('../src');

async function main() {
  if (!process.env.LPD_TOKEN) {
    console.error('Error: LPD_TOKEN environment variable is required');
    console.error('Get your token at https://lightpanda.io');
    process.exit(1);
  }

  try {
    console.log('Searching HackerNews using cloud browser...\n');

    const results = await search('javascript', {
      isCloud: true,
      timeout: 15000,
    });

    console.log(`Found ${results.length} results:\n`);

    results.slice(0, 5).forEach((result, index) => {
      console.log(`${index + 1}. ${result.title}`);
      console.log(`   ${result.url}`);
      if (result.meta.length > 0) {
        console.log(`   ${result.meta.join(' | ')}`);
      }
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
