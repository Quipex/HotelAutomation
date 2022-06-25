import { Context } from 'telegraf';
import { parseDateFromLiterals } from '~/common/utils/dates';

const parseDateAndReplyToInvalid = async (ctx: Context, text?: string): Promise<Date | null> => {
  const messageText = text ?? ctx.message!.text;
  const [, argument] = messageText.split(' ');
  const date = parseDateFromLiterals(argument ?? 'today');
  if (!date) {
    await ctx.reply(`❌ Unrecognized date: ${argument}`);
  }
  return date;
};

export { parseDateAndReplyToInvalid };
