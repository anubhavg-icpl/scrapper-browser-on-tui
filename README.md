# HackerNews Scraper

Production-ready web scraper for HackerNews built with [Lightpanda](https://lightpanda.io), a fast headless browser designed for AI and automation.

## Features

- 🚀 **Fast**: Built on Lightpanda, up to 10x faster than Headless Chrome
- 🌐 **Flexible**: Works with both local and cloud browsers
- 🔧 **Production-Ready**: Comprehensive error handling, logging, and configuration
- 📦 **Easy to Use**: Simple CLI and programmatic API
- 🎯 **Extensible**: Custom scraping functions for any website
- 🔒 **Secure**: Environment-based configuration for sensitive data

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [CLI Usage](#cli-usage)
  - [Programmatic Usage](#programmatic-usage)
- [Configuration](#configuration)
- [Examples](#examples)
- [API Reference](#api-reference)
- [Development](#development)
- [License](#license)

## Installation

```bash
# Clone the repository
git clone https://github.com/anubhavg-icpl/scrapper-browser-on-tui.git
cd hn-scraper

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

## Quick Start

### Using the CLI

```bash
# Search HackerNews (local browser)
npm run scrape -- rust

# Search with cloud browser (requires LPD_TOKEN)
npm run scrape:cloud -- "artificial intelligence"

# Get JSON output
node src/cli.js --json "web scraping"
```

### Using Programmatically

```javascript
const { search } = require('./src');

const results = await search('javascript');
console.log(results);
```

## Usage

### CLI Usage

The CLI provides a simple interface for searching HackerNews:

```bash
# Basic search
node src/cli.js [search_term]

# With options
node src/cli.js [OPTIONS] [search_term]
```

**Options:**

- `-s, --search <term>` - Search term
- `-c, --cloud` - Use cloud browser (requires LPD_TOKEN)
- `-l, --local` - Use local browser (default)
- `-j, --json` - Output as JSON
- `-p, --pretty` - Pretty print output (default)
- `-h, --help` - Show help
- `-v, --version` - Show version

**Examples:**

```bash
# Search for "rust"
node src/cli.js rust

# Cloud search with JSON output
node src/cli.js --cloud --json "machine learning"

# Explicit search flag
node src/cli.js --search "web3"
```

### Programmatic Usage

#### Simple Search

```javascript
const { search } = require('./src');

async function main() {
  const results = await search('rust', {
    isCloud: false,
    timeout: 10000,
  });

  console.log(results);
}

main();
```

#### Using the Scraper Class

```javascript
const { HNScraper } = require('./src');

async function main() {
  const scraper = new HNScraper({
    isCloud: false,
    searchTerm: 'javascript',
  });

  const results = await scraper.execute(async (s) => {
    return await s.search('javascript');
  });

  console.log(results);
}

main();
```

#### Custom Web Scraping

```javascript
const { HNScraper } = require('./src');

async function main() {
  const scraper = new HNScraper({ isCloud: false });

  const data = await scraper.execute(async (s) => {
    return await s.scrapeUrl(
      'https://example.com',
      () => {
        // This runs in the browser context
        return Array.from(document.querySelectorAll('a')).map(a => ({
          text: a.textContent,
          href: a.href,
        }));
      }
    );
  });

  console.log(data);
}

main();
```

## Configuration

Configuration is managed through environment variables. Copy `.env.example` to `.env` and configure:

```bash
# Cloud Browser
USE_CLOUD=false
LPD_TOKEN=your_token_here

# Local Browser
LPD_HOST=127.0.0.1
LPD_PORT=9222

# Scraper
TIMEOUT=10000
SEARCH_TERM=lightpanda

# Logging
LOG_LEVEL=info
LOG_FORMAT=pretty
```

### Cloud Browser Setup

1. Create an account at [lightpanda.io](https://lightpanda.io)
2. Get your API token
3. Set `LPD_TOKEN` in your `.env` file
4. Run with `--cloud` flag or set `USE_CLOUD=true`

## Examples

### Basic Search

```bash
npm run example:basic
```

See `examples/basic-search.js` for the code.

### Custom Scraper

```bash
npm run example:custom
```

See `examples/custom-scraper.js` for the code.

### Cloud Browser

```bash
# Set your token first
export LPD_TOKEN="your_token"
node examples/cloud-scraper.js
```

## API Reference

### `search(searchTerm, options)`

Quick search function.

**Parameters:**
- `searchTerm` (string): Term to search for
- `options` (object):
  - `isCloud` (boolean): Use cloud browser
  - `timeout` (number): Request timeout in ms
  - `searchTerm` (string): Override search term

**Returns:** `Promise<Array>` - Array of search results

### `scrapeUrl(url, extractorFn, options)`

Scrape a custom URL.

**Parameters:**
- `url` (string): URL to scrape
- `extractorFn` (function): Function to extract data (runs in browser)
- `options` (object): Scraper options

**Returns:** `Promise<any>` - Extracted data

### Class: `HNScraper`

Main scraper class.

**Constructor Options:**
- `isCloud` (boolean): Use cloud browser
- `searchTerm` (string): Default search term
- `timeout` (number): Request timeout

**Methods:**

#### `initialize()`

Initialize browser connection.

#### `search(searchTerm)`

Search HackerNews.

**Returns:** `Promise<Array>` - Search results

#### `scrapeUrl(url, extractorFn)`

Scrape custom URL.

**Returns:** `Promise<any>` - Extracted data

#### `cleanup()`

Clean up browser resources.

#### `execute(operation)`

Execute operation with automatic cleanup.

**Parameters:**
- `operation` (function): Async function receiving scraper instance

**Returns:** `Promise<any>` - Operation result

## Development

### Project Structure

```
hn-scraper/
├── src/
│   ├── index.js          # Main exports
│   ├── scraper.js        # Scraper class
│   ├── cli.js            # CLI interface
│   ├── config.js         # Configuration
│   └── utils/
│       └── logger.js     # Logging utility
├── examples/
│   ├── basic-search.js   # Basic usage
│   ├── custom-scraper.js # Custom scraping
│   └── cloud-scraper.js  # Cloud browser
├── index.js              # Simple entry point
├── .env.example          # Environment template
└── package.json
```

### NPM Scripts

```bash
npm start              # Run main entry point
npm run dev            # Development mode
npm run scrape         # Run CLI
npm run scrape:cloud   # Run with cloud browser
npm run scrape:local   # Run with local browser
npm run example:basic  # Run basic example
npm run example:custom # Run custom example
```

### Adding Custom Scrapers

Create a new scraper by extending the base functionality:

```javascript
const { HNScraper } = require('./src');

class MyCustomScraper extends HNScraper {
  async scrapeCustomSite() {
    return await this.scrapeUrl('https://example.com', () => {
      // Custom extraction logic
      return document.title;
    });
  }
}
```

## Why Lightpanda?

Lightpanda is a headless browser built from scratch in Zig, designed specifically for automation and AI:

- **10x Faster**: No UI rendering overhead
- **Instant Startup**: No heavy browser initialization
- **JavaScript Support**: Full JS execution unlike curl
- **CDP Compatible**: Works with Puppeteer and Playwright
- **Cloud Ready**: Easy deployment with managed cloud service

Learn more at [lightpanda.io](https://lightpanda.io)

## Troubleshooting

### Local Browser Won't Start

Make sure port 9222 is available:
```bash
lsof -i :9222
```

### Cloud Connection Failed

Check your token:
```bash
echo $LPD_TOKEN
```

Visit [console.lightpanda.io](https://console.lightpanda.io) to verify your account.

### Timeout Errors

Increase timeout in `.env`:
```
TIMEOUT=20000
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Links

- [Lightpanda Documentation](https://docs.lightpanda.io)
- [Lightpanda GitHub](https://github.com/lightpanda-io/browser)
- [Puppeteer Documentation](https://pptr.dev)

---

Built with ❤️ using [Lightpanda](https://lightpanda.io)
