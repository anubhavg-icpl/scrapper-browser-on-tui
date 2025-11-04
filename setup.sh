#!/bin/bash

# HackerNews Scraper Setup Script

set -e

echo "=================================="
echo "  HackerNews Scraper Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js detected: $NODE_VERSION"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Setup environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  Please edit .env file with your configuration"
    echo "   For cloud usage, add your LPD_TOKEN"
else
    echo "ℹ️  .env file already exists, skipping..."
fi

echo ""
echo "=================================="
echo "  Setup Complete!"
echo "=================================="
echo ""
echo "🚀 Quick Start:"
echo ""
echo "  Local browser:"
echo "    npm start"
echo "    npm run scrape -- rust"
echo ""
echo "  Cloud browser (requires LPD_TOKEN):"
echo "    npm run scrape:cloud -- javascript"
echo ""
echo "  Examples:"
echo "    npm run example:basic"
echo "    npm run example:custom"
echo ""
echo "  CLI Help:"
echo "    node src/cli.js --help"
echo ""
echo "📖 Documentation: README.md"
echo "🐛 Issues: https://github.com/anubhavg-icpl/scrapper-browser-on-tui/issues"
echo ""
