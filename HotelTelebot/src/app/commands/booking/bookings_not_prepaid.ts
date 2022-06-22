import { Context } from 'telegraf';
import { replyWithBookingsThatNeedRemindings } from '~/app/commands';
// noinspection ES6PreferShortImport
import { parseDateAndReplyToInvalid } from './bookings_added';

const parseCommandFindBookingsNotPrePayedAndReply = async (ctx: Context) => {
  const date = await parseDateAndReplyToInvalid(ctx);
  if (!date) {
    return;
  }

  await replyWithBookingsThatNeedRemindings(ctx, date);
};

export { parseCommandFindBookingsNotPrePayedAndReply };
