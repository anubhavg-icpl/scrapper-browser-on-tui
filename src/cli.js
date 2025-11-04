#!/usr/bin/env node

'use strict';

const HNScraper = require('./scraper');
const logger = require('./utils/logger');
const config = require('./config');

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    command: 'search',
    searchTerm: config.searchTerm,
    outputFormat: 'pretty',
    isCloud: config.isCloud,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      case '--search':
      case '-s':
        options.searchTerm = args[++i];
        break;
      case '--cloud':
      case '-c':
        options.isCloud = true;
        break;
      case '--local':
      case '-l':
        options.isCloud = false;
        break;
      case '--json':
      case '-j':
        options.outputFormat = 'json';
        break;
      case '--pretty':
      case '-p':
        options.outputFormat = 'pretty';
        break;
      case '--version':
      case '-v':
        printVersion();
        process.exit(0);
        break;
      default:
        if (!args[i].startsWith('-')) {
          options.searchTerm = args[i];
        }
    }
  }

  return options;
}

/**
 * Print help message
 */
function printHelp() {
  console.log(`
HackerNews Scraper - Production-ready web scraper using Lightpanda

USAGE:
  hn-scraper [OPTIONS] [SEARCH_TERM]

OPTIONS:
  -s, --search <term>    Search term (default: from config or 'lightpanda')
  -c, --cloud            Use cloud browser (requires LPD_TOKEN)
  -l, --local            Use local browser (default)
  -j, --json             Output results as JSON
  -p, --pretty           Output results in pretty format (default)
  -h, --help             Show this help message
  -v, --version          Show version

EXAMPLES:
  # Search for "rust" using local browser
  hn-scraper rust

  # Search using cloud browser with JSON output
  hn-scraper --cloud --json "web scraping"

  # Search with explicit search flag
  hn-scraper --search "artificial intelligence"

ENVIRONMENT VARIABLES:
  LPD_TOKEN             Cloud browser authentication token
  USE_CLOUD             Set to 'true' to use cloud by default
  LPD_HOST              Local browser host (default: 127.0.0.1)
  LPD_PORT              Local browser port (default: 9222)
  TIMEOUT               Request timeout in ms (default: 10000)
  LOG_LEVEL             Log level: debug, info, warn, error (default: info)
  LOG_FORMAT            Log format: pretty, json (default: pretty)

For more information, visit: https://github.com/yourusername/hn-scraper
  `);
}

/**
 * Print version
 */
function printVersion() {
  const pkg = require('../package.json');
  console.log(`hn-scraper v${pkg.version}`);
}

/**
 * Format and output results
 */
function outputResults(results, format) {
  if (format === 'json') {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log('\n' + '='.repeat(80));
    console.log(`Found ${results.length} results`);
    console.log('='.repeat(80) + '\n');

    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.title}`);
      console.log(`   URL: ${result.url}`);
      if (result.meta && result.meta.length > 0) {
        console.log(`   Meta: ${result.meta.join(' | ')}`);
      }
      console.log('');
    });
  }
}

/**
 * Main CLI function
 */
async function main() {
  const options = parseArgs();

  logger.info('Starting HackerNews scraper', {
    searchTerm: options.searchTerm,
    mode: options.isCloud ? 'cloud' : 'local',
  });

  const scraper = new HNScraper({
    isCloud: options.isCloud,
    searchTerm: options.searchTerm,
  });

  try {
    const results = await scraper.execute(async (s) => {
      return await s.search(options.searchTerm);
    });

    outputResults(results, options.outputFormat);

    process.exit(0);
  } catch (error) {
    logger.error('Scraper failed', { error: error.message });
    process.exit(1);
  }
}

// Run CLI if executed directly
if (require.main === module) {
  main().catch((error) => {
    logger.error('Fatal error', { error: error.message });
    process.exit(1);
  });
}

module.exports = { main, parseArgs };
