'use strict';

/**
 * Basic Search Example
 *
 * This example shows how to perform a simple HackerNews search
 */

const { search } = require('../src');

async function main() {
  try {
    console.log('Searching HackerNews for "rust"...\n');

    const results = await search('rust', {
      isCloud: false, // Use local browser
      timeout: 10000,
    });

    console.log(`Found ${results.length} results:\n`);

    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.title}`);
      console.log(`   ${result.url}`);
      console.log('');
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
