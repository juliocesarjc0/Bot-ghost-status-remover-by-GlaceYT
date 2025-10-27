/**
 * Express Server Module
 * Handles HTTP server for health checks and status endpoints
 */

const express = require('express');
const { createLogger } = require('./logger');
const config = require('./config');

const logger = createLogger('ExpressServer');

/**
 * Express Server Manager Class
 */
class ExpressServer {
  constructor(bot) {
    this.app = express();
    this.server = null;
    this.bot = bot;
    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Sets up Express middleware
   */
  setupMiddleware() {
    // Parse JSON bodies
    this.app.use(express.json());

    // Request logging middleware
    this.app.use((req, res, next) => {
      logger.debug(`${req.method} ${req.path}`);
      next();
    });

    // Error handling middleware
    this.app.use((err, req, res, next) => {
      logger.error('Express error', err);
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
    });
  }

  /**
   * Sets up Express routes
   */
  setupRoutes() {
    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: '✨ Discord Status Bot is running',
        status: 'online',
        timestamp: new Date().toISOString(),
      });
    });

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      const botStatus = this.bot.getStatus();
      const health = {
        status: botStatus.isReady ? 'healthy' : 'unhealthy',
        bot: botStatus,
        server: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
        },
        timestamp: new Date().toISOString(),
      };

      const statusCode = botStatus.isReady ? 200 : 503;
      res.status(statusCode).json(health);
    });

    // Status endpoint
    this.app.get('/status', (req, res) => {
      const botStatus = this.bot.getStatus();
      res.json({
        bot: botStatus,
        config: {
          statusMessages: config.discord.statusMessages,
          updateInterval: config.discord.updateInterval,
        },
        timestamp: new Date().toISOString(),
      });
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        error: 'Not found',
        path: req.path,
      });
    });
  }

  /**
   * Starts the Express server
   * @returns {Promise<void>}
   */
  async start() {
    return new Promise((resolve, reject) => {
      try {
        this.server = this.app.listen(config.server.port, () => {
          logger.success(
            `Server listening on http://${config.server.host}:${config.server.port}`
          );
          logger.info('Available endpoints:');
          logger.info(`  - GET / (Root)`);
          logger.info(`  - GET /health (Health check)`);
          logger.info(`  - GET /status (Bot status)`);
          resolve();
        });

        this.server.on('error', (error) => {
          if (error.code === 'EADDRINUSE') {
            logger.error(`Port ${config.server.port} is already in use`);
          } else {
            logger.error('Server error', error);
          }
          reject(error);
        });
      } catch (error) {
        logger.error('Failed to start server', error);
        reject(error);
      }
    });
  }

  /**
   * Stops the Express server
   * @returns {Promise<void>}
   */
  async stop() {
    return new Promise((resolve) => {
      if (this.server) {
        logger.info('Shutting down Express server...');
        this.server.close(() => {
          logger.success('Express server shut down successfully');
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = ExpressServer;
