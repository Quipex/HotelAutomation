import { Context } from 'telegraf';
import { replyWithNotPrepaidRemindedExpired, parseDateAndReplyToInvalid } from '~/app/commands';

const findBookingsRemindedAndExpiredPrepayment = async (ctx: Context) => {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    return;
  }

  await replyWithNotPrepaidRemindedExpired(ctx, date);
};

export { findBookingsRemindedAndExpiredPrepayment };
