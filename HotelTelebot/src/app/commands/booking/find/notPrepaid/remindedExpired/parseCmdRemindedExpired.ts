import { Context } from 'telegraf';
import { parseDateAndReplyToInvalid } from '~@commands/helpers';
// noinspection ES6PreferShortImport
import { findNotPrepaidRemindedExpiredAndReply } from './findNotPrepaidRemindedExpiredAndReply';

const parseCmdRemindedExpired = async (ctx: Context) => {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    return;
  }

  await findNotPrepaidRemindedExpiredAndReply(ctx, date);
};

export { parseCmdRemindedExpired };
