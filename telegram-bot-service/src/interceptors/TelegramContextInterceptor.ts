import { Context } from 'telegraf';
import axios, { InternalAxiosRequestConfig } from 'axios';

/**
 * Interceptor for Telegram requests to include user context information
 * in the HTTP headers for audit logging and ABAC
 */
export function setupTelegramContextInterceptor() {
  // Add a request interceptor to axios
  axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // Get the telegram context from the ThreadLocal storage
    const telegramContext = getTelegramContext();
    
    // If there's no active context, return config as is
    if (!telegramContext) {
      return config;
    }
    
    // Add Telegram user context to headers
    config.headers.set('X-Platform', 'telegram');
    config.headers.set('X-User-ID', String(telegramContext.from?.id || 'unknown'));
    config.headers.set('X-User-Name', `${telegramContext.from?.first_name || ''} ${telegramContext.from?.last_name || ''}`.trim());
    config.headers.set('X-User-Nick', telegramContext.from?.username || '');
    
    return config;
  });
}

// ThreadLocal-like storage to store Telegram context during a request
const asyncLocalStorage = new Map<number, Context>();
let nextContextId = 1;

/**
 * Set the current Telegram context for the duration of processing this update
 * @param ctx Telegram context
 * @param callback Function to execute while context is active
 */
export async function withTelegramContext<T>(ctx: Context, callback: () => Promise<T>): Promise<T> {
  const contextId = nextContextId++;
  try {
    // Store the context
    asyncLocalStorage.set(contextId, ctx);
    
    // Execute the callback
    return await callback();
  } finally {
    // Clean up
    asyncLocalStorage.delete(contextId);
  }
}

/**
 * Get the current Telegram context
 * @returns The current Telegram context or undefined if not set
 */
function getTelegramContext(): Context | undefined {
  // For simplicity, we'll just return the last context added
  // In a real implementation, you'd use AsyncLocalStorage from Node.js
  // or a more robust thread-local mechanism
  if (asyncLocalStorage.size === 0) {
    return undefined;
  }
  
  // Get the most recently added context
  const latestContextId = Math.max(...asyncLocalStorage.keys());
  return asyncLocalStorage.get(latestContextId);
} 