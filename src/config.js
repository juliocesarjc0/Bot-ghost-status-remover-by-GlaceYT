/**
 * Configuration Module
 * Centralizes all configuration and environment variable validation
 */

require('dotenv').config();

/**
 * Validates that required environment variables are present
 * @throws {Error} If required variables are missing
 */
function validateConfig() {
  const errors = [];

  if (!process.env.TOKEN) {
    errors.push('TOKEN is required in .env file');
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Application configuration object
 */
const config = {
  // Discord Bot Configuration
  discord: {
    token: process.env.TOKEN,
    statusMessages: process.env.STATUS_MESSAGES 
      ? process.env.STATUS_MESSAGES.split(',').map(s => s.trim())
      : ['PLAYING', 'MUSIC'],
    statusType: process.env.STATUS_TYPE || 'Custom',
    statusState: process.env.STATUS_STATE || 'dnd',
    updateInterval: parseInt(process.env.UPDATE_INTERVAL || '10000', 10),
    channelId: process.env.CHANNEL_ID || '', // Optional: channel for status messages
  },

  // Express Server Configuration
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
  },

  // Application Configuration
  app: {
    name: process.env.APP_NAME || 'Discord Status Bot',
    environment: process.env.NODE_ENV || 'development',
  },
};

/**
 * Initializes and validates configuration
 * @returns {Object} Validated configuration object
 */
function initConfig() {
  try {
    validateConfig();
    return config;
  } catch (error) {
    console.error('❌ Configuration Error:', error.message);
    process.exit(1);
  }
}

module.exports = initConfig();
