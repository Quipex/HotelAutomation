import { Context } from 'telegraf';
import { parseDateAndReplyToInvalid } from '~@commands/helpers';
// noinspection ES6PreferShortImport
import { findBookingsThatWereAddedAfterAndReply } from './findBookingsThatWereAddedAfterAndReply';

const parseCmdFetchBookingsAddedAfter = async (ctx: Context) => {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    return;
  }

  await findBookingsThatWereAddedAfterAndReply(ctx, { date });
};

export { parseCmdFetchBookingsAddedAfter };
