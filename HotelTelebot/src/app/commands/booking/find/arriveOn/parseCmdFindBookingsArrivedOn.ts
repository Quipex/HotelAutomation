import { Context } from 'telegraf';
import { parseDateAndReplyToInvalid } from '~@commands/helpers';
// noinspection ES6PreferShortImport
import { findBookingsArrivedOnAndReply } from './findBookingsArrivedOnAndReply';

const parseCmdFindBookingsArrivedOn = async (ctx: Context) => {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    return;
  }

  await findBookingsArrivedOnAndReply(ctx, date);
};

export { parseCmdFindBookingsArrivedOn };
