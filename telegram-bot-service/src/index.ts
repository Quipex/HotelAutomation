import dotenv from 'dotenv';
import express from 'express';
import bot from './bot';

// Load environment variables
dotenv.config();

// Create Express server for health checks
const PORT = process.env.PORT || 3000;
const app = express();

// Set up health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    service: 'telegram-bot-service'
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
});

// Start the bot
console.log('Starting Telegram bot...');
bot.launch()
  .then(() => {
    console.log('Bot started successfully');
  })
  .catch((err) => {
    console.error('Error starting bot:', err);
    process.exit(1);
  });

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  console.log('Bot stopped due to SIGINT');
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  console.log('Bot stopped due to SIGTERM');
});
