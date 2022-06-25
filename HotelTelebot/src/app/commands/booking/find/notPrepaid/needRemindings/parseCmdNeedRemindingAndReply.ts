import { Context } from 'telegraf';
import { parseDateAndReplyToInvalid } from '~@commands/helpers';
// noinspection ES6PreferShortImport
import { findNotPrepaidNeedRemindingsAndReply } from './findNotPrepaidNeedRemindingsAndReply';

const parseCmdFindBookingsNotPrepaid = async (ctx: Context) => {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    return;
  }

  await findNotPrepaidNeedRemindingsAndReply(ctx, date);
};

export { parseCmdFindBookingsNotPrepaid };
