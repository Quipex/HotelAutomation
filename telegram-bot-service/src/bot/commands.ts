import TelegramBot from 'node-telegram-bot-api';
import { logger } from '../utils/logger';
import { apiClient } from '../api/apiClient';

export function setupBotCommands(bot: TelegramBot, backendApiUrl: string): void {
  // Register command list with Telegram
  bot.setMyCommands([
    { command: '/start', description: 'Start the bot and get welcome message' },
    { command: '/help', description: 'Show available commands' },
    { command: '/status', description: 'Check backend service status' },
  ]);

  // Create API client
  const api = apiClient(backendApiUrl);

  // Start command handler
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Welcome to Hotel Management Bot! Type /help to see available commands.');
  });

  // Help command handler
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 
      'Available commands:\n' +
      '/start - Start the bot\n' +
      '/help - Show this message\n' +
      '/status - Check backend service status'
    );
  });

  // Status command handler
  bot.onText(/\/status/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      // Attempt to get health status from backend
      const response = await api.checkHealth();
      bot.sendMessage(chatId, `Backend service status: ${response.status}`);
    } catch (error) {
      logger.error('Error checking backend status:', error);
      bot.sendMessage(chatId, 'Unable to connect to backend service. Please try again later.');
    }
  });

  // Default message handler for unrecognized messages
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    // Check if this is a command before responding
    if (!msg.text?.startsWith('/')) {
      bot.sendMessage(chatId, 'I don\'t understand that command. Type /help to see available commands.');
    }
  });
} 