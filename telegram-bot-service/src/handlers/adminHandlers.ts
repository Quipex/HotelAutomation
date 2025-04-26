import { Telegraf } from 'telegraf';
import { api } from '../api';
import { withTelegramContext } from '../interceptors/TelegramContextInterceptor';

/**
 * Register administration-related command handlers
 * @param bot The Telegraf bot instance
 */
export function registerAdminHandlers(bot: Telegraf) {
  // Handler for reloading ABAC policies
  bot.command('reload_abac', async (ctx) => {
    await withTelegramContext(ctx, async () => {
      try {
        await ctx.reply('Reloading ABAC policies...');
        
        // Call the backend API to reload policies
        const response = await api.reloadPolicies();
        
        if (response.data.success) {
          await ctx.reply('✅ ABAC policies reloaded successfully.');
        } else {
          await ctx.reply(`❌ Failed to reload ABAC policies: ${response.data.message}`);
        }
      } catch (error) {
        console.error('Error reloading ABAC policies:', error);
        await ctx.reply('❌ Error reloading ABAC policies. Please check server logs.');
      }
    });
  });
} 