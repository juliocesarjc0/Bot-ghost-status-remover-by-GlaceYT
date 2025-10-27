/**
 * Discord Bot Module
 * Handles Discord bot initialization, status updates, and event handling
 */

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { createLogger } = require('./logger');
const config = require('./config');

const logger = createLogger('DiscordBot');

/**
 * Discord Bot Manager Class
 */
class DiscordBot {
  constructor() {
    this.client = null;
    this.statusIndex = 0;
    this.statusInterval = null;
    this.isReady = false;
  }

  /**
   * Initializes the Discord client with required intents
   */
  initializeClient() {
    try {
      this.client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
        ],
      });

      this.setupEventHandlers();
      logger.success('Discord client initialized');
    } catch (error) {
      logger.error('Failed to initialize Discord client', error);
      throw error;
    }
  }

  /**
   * Sets up event handlers for the Discord client
   */
  setupEventHandlers() {
    this.client.once('ready', () => {
      this.onReady();
    });

    this.client.on('error', (error) => {
      logger.error('Discord client error', error);
    });

    this.client.on('warn', (warning) => {
      logger.warn(`Discord client warning: ${warning}`);
    });

    // Handle disconnect
    this.client.on('disconnect', () => {
      logger.warn('Discord client disconnected');
      this.isReady = false;
    });

    // Handle reconnect
    this.client.on('resume', () => {
      logger.info('Discord client reconnected');
      this.isReady = true;
    });
  }

  /**
   * Handles the ready event when bot successfully connects
   */
  onReady() {
    this.isReady = true;
    logger.success(`Bot logged in as ${this.client.user.tag}`);
    logger.info(`Bot is ready and serving ${this.client.guilds.cache.size} guilds`);
    
    // Set initial status
    this.updateStatus();

    // Start status rotation
    this.startStatusRotation();
  }

  /**
   * Updates the bot's status/presence
   */
  updateStatus() {
    try {
      if (!this.isReady || !this.client.user) {
        logger.warn('Cannot update status: Bot not ready');
        return;
      }

      const statusMessages = config.discord.statusMessages;
      const currentStatus = statusMessages[this.statusIndex];

      this.client.user.setPresence({
        activities: [{
          name: currentStatus,
          type: ActivityType[config.discord.statusType] || ActivityType.Custom,
        }],
        status: config.discord.statusState,
      });

      logger.debug(`Status updated to: ${currentStatus}`);

      // Send message to channel if configured
      if (config.discord.channelId) {
        this.sendStatusMessage(currentStatus);
      }

      // Move to next status
      this.statusIndex = (this.statusIndex + 1) % statusMessages.length;
    } catch (error) {
      logger.error('Failed to update status', error);
    }
  }

  /**
   * Sends a status update message to the configured channel
   * @param {string} status - The current status message
   */
  async sendStatusMessage(status) {
    try {
      const channel = await this.client.channels.fetch(config.discord.channelId);
      
      if (channel && channel.isTextBased()) {
        await channel.send(`🎵 Bot status: ${status}`);
        logger.debug(`Status message sent to channel ${config.discord.channelId}`);
      }
    } catch (error) {
      // Don't log error if channel ID is empty or invalid
      if (config.discord.channelId) {
        logger.warn(`Could not send message to channel: ${error.message}`);
      }
    }
  }

  /**
   * Starts the status rotation interval
   */
  startStatusRotation() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }

    this.statusInterval = setInterval(() => {
      this.updateStatus();
    }, config.discord.updateInterval);

    logger.info(`Status rotation started (interval: ${config.discord.updateInterval}ms)`);
  }

  /**
   * Stops the status rotation interval
   */
  stopStatusRotation() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
      logger.info('Status rotation stopped');
    }
  }

  /**
   * Logs in the bot with the provided token
   */
  async login() {
    try {
      logger.info('Attempting to log in to Discord...');
      await this.client.login(config.discord.token);
    } catch (error) {
      logger.error('Failed to log in to Discord', error);
      throw new Error('Discord login failed. Please check your TOKEN in .env file');
    }
  }

  /**
   * Gracefully shuts down the bot
   */
  async shutdown() {
    logger.info('Shutting down Discord bot...');
    
    this.stopStatusRotation();
    
    if (this.client) {
      try {
        await this.client.destroy();
        logger.success('Discord bot shut down successfully');
      } catch (error) {
        logger.error('Error during bot shutdown', error);
      }
    }
  }

  /**
   * Gets the bot's ready status
   * @returns {boolean} Whether the bot is ready
   */
  getStatus() {
    return {
      isReady: this.isReady,
      username: this.client?.user?.tag || 'Not logged in',
      guilds: this.client?.guilds?.cache.size || 0,
      uptime: this.client?.uptime || 0,
    };
  }
}

module.exports = DiscordBot;
