'use strict';

require('dotenv').config();

/**
 * Application configuration
 */
const config = {
  // Cloud configuration
  isCloud: process.env.USE_CLOUD === 'true' || false,
  cloudToken: process.env.LPD_TOKEN || '',

  // Local browser configuration
  local: {
    host: process.env.LPD_HOST || '127.0.0.1',
    port: parseInt(process.env.LPD_PORT || '9222', 10),
  },

  // Scraper configuration
  timeout: parseInt(process.env.TIMEOUT || '10000', 10),
  searchTerm: process.env.SEARCH_TERM || 'lightpanda',

  // Logging configuration
  logLevel: process.env.LOG_LEVEL || 'info',
  logFormat: process.env.LOG_FORMAT || 'pretty', // 'pretty' or 'json'
};

module.exports = config;
