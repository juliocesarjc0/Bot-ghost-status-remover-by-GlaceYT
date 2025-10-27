/**
 * Discord Status Bot - Main Entry Point
 * A Discord bot that rotates status messages with an Express health check server
 * 
 * Repository: https://github.com/juliocesarjc0/CAROL-STORE
 */

const { createLogger } = require('./src/logger');
const DiscordBot = require('./src/bot');
const ExpressServer = require('./src/server');
const config = require('./src/config');

const logger = createLogger('Main');

// Application state
let bot = null;
let server = null;
let isShuttingDown = false;

/**
 * Gracefully shuts down the application
 */
async function gracefulShutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info(`Received ${signal}, shutting down gracefully...`);

  try {
    // Stop the bot first
    if (bot) {
      await bot.shutdown();
    }

    // Then stop the server
    if (server) {
      await server.stop();
    }

    logger.success('Application shut down successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error);
    process.exit(1);
  }
}

/**
 * Initializes and starts the application
 */
async function main() {
  try {
    logger.info('='.repeat(50));
    logger.info(`Starting ${config.app.name}`);
    logger.info(`Environment: ${config.app.environment}`);
    logger.info('='.repeat(50));

    // Initialize Discord bot
    bot = new DiscordBot();
    bot.initializeClient();
    await bot.login();

    // Initialize Express server
    server = new ExpressServer(bot);
    await server.start();

    logger.success('Application started successfully');
    logger.info('Press Ctrl+C to stop');

  } catch (error) {
    logger.error('Failed to start application', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise);
  logger.error('Reason:', reason);
});

// Start the application
main();
