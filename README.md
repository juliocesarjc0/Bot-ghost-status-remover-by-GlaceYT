# Discord Status Bot

A professional Discord bot that automatically rotates status messages with a built-in health check server. Features modular architecture, comprehensive error handling, and easy configuration.

## ✨ Features

- 🔄 **Automatic Status Rotation** - Cycles through custom status messages at configurable intervals
- 🏥 **Health Check Server** - Built-in Express server with health and status endpoints
- 📦 **Modular Architecture** - Clean, maintainable code structure with separated concerns
- 🛡️ **Error Handling** - Comprehensive error handling and graceful shutdown
- 📝 **Logging System** - Structured logging with different log levels and colors
- ⚙️ **Easy Configuration** - Environment-based configuration with validation
- 🚀 **Production Ready** - Optimized dependencies and best practices

## 📋 Requirements

- Node.js 18.0.0 or higher
- A Discord Bot Token ([Get one here](https://discord.com/developers/applications))

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/juliocesarjc0/CAROL-STORE.git
cd CAROL-STORE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and edit it with your settings:

```bash
cp .env.example .env
```

Edit `.env` and add your Discord bot token:

```env
TOKEN=your_discord_bot_token_here
STATUS_MESSAGES=PLAYING,MUSIC,ONLINE,VIBING
UPDATE_INTERVAL=10000
```

### 4. Start the bot

```bash
npm start
```

For development mode with debug logging:

```bash
npm run dev
```

## ⚙️ Configuration

All configuration is done through environment variables in the `.env` file:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `TOKEN` | Discord bot token | - | ✅ Yes |
| `STATUS_MESSAGES` | Comma-separated status messages | `PLAYING,MUSIC` | No |
| `STATUS_TYPE` | Activity type (Custom, Playing, Watching, etc.) | `Custom` | No |
| `STATUS_STATE` | Bot status (online, idle, dnd, invisible) | `dnd` | No |
| `UPDATE_INTERVAL` | Rotation interval in milliseconds | `10000` | No |
| `CHANNEL_ID` | Optional channel for status messages | - | No |
| `PORT` | Express server port | `3000` | No |
| `HOST` | Express server host | `localhost` | No |

## 🌐 API Endpoints

The bot includes an Express server with the following endpoints:

- `GET /` - Root endpoint with basic info
- `GET /health` - Health check endpoint (returns bot status)
- `GET /status` - Detailed bot status and configuration

Example health check response:

```json
{
  "status": "healthy",
  "bot": {
    "isReady": true,
    "username": "YourBot#1234",
    "guilds": 5,
    "uptime": 123456
  },
  "server": {
    "uptime": 123.456,
    "memory": {...}
  },
  "timestamp": "2025-10-27T12:00:00.000Z"
}
```

## 📁 Project Structure

```
.
├── index.js              # Main entry point
├── src/
│   ├── bot.js           # Discord bot logic
│   ├── server.js        # Express server
│   ├── config.js        # Configuration management
│   └── logger.js        # Logging utilities
├── package.json
├── .env.example
└── README.md
```

## 🔧 Development

### Code Structure

The project follows a modular architecture:

- **bot.js** - Handles Discord client, status updates, and event handling
- **server.js** - Express server with health check endpoints
- **config.js** - Centralized configuration with validation
- **logger.js** - Structured logging system
- **index.js** - Application entry point with graceful shutdown

### Adding New Features

1. Keep modules focused on single responsibilities
2. Use the logger for all output
3. Add configuration to `config.js`
4. Handle errors gracefully
5. Update documentation

## 🐛 Troubleshooting

### Bot won't start

- Verify your `TOKEN` is correct in `.env`
- Check that Node.js version is 18.0.0 or higher
- Ensure all dependencies are installed (`npm install`)

### Port already in use

- Change the `PORT` in your `.env` file
- Or stop the process using port 3000

### Status not updating

- Check bot has proper permissions in Discord
- Verify `UPDATE_INTERVAL` is set correctly
- Check logs for error messages

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Repository](https://github.com/juliocesarjc0/CAROL-STORE)

