import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Check if we're in a test environment
const isTestEnv = process.env.NODE_ENV === 'test';

// Export environment variables with required validation
export const botToken = process.env.BOT_TOKEN || (isTestEnv ? 'TEST_TOKEN' : '');
export const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080/api';

// Validate required environment variables only in non-test environments
if (!botToken && !isTestEnv) {
  throw new Error('BOT_TOKEN environment variable is not set');
}

// Additional config settings
export const config = {
  botToken,
  backendUrl
};

export default config;
