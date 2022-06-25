import { Context, Middleware } from 'telegraf';
import { DASHBOARD_LITERAL } from '~/common/constants';
import { formatDate, parseDateFromLiterals } from '~/common/utils/dates';
import { Dashboard, DashboardActions } from '~@components';
import { DashboardService } from '~@services';

const replyWithUsage = async (ctx: Context) => {
  await ctx.replyWithHTML(`Usage: <code>/${DASHBOARD_LITERAL} [date(today, yesterday, 15.06, etc.)]</code>`);
};

const replyWithDashboard = async (ctx: Context, date: string, messageId?: number) => {
  const status = await DashboardService.getDailyStatus(date);
  await ctx.replyWithHTML(
    Dashboard(status, new Date(date)),
    {
      reply_markup: { inline_keyboard: DashboardActions(new Date(date)) },
      ...(messageId && { reply_to_message_id: messageId })
    }
  );
};

const parseCmdDashboard: Middleware<Context> = async (ctx) => {
  const [, argument] = ctx.message.text.split(' ');
  const date = parseDateFromLiterals(argument ?? 'today');
  if (!date) {
    await replyWithUsage(ctx);
    return;
  }
  await replyWithDashboard(ctx, formatDate(date), ctx.message.message_id);
};

export { parseCmdDashboard, replyWithDashboard };
