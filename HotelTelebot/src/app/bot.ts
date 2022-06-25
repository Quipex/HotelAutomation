import { Telegraf } from 'telegraf';
import { handleCallbackQuery } from '~/app/callbacks';
import {
  parseCmdCreateBooking,
  parseCmdDashboard,
  parseCmdFetchBookingsAddedAfter,
  parseCmdFindBookingById,
  parseCmdFindBookingsArrivedOn,
  parseCmdFindBookingsNotPrepaid,
  parseCmdFindClient,
  parseCmdFindClientById,
  parseCmdFindUnreadNotifications,
  parseCmdMvBooking,
  parseCmdMvBookingInBatch,
  parseCmdRemindedExpired,
  parseCmdSetBookingNote,
  parseCmdSetClientNote,
  parseCmdSynchronizeData
} from '~/app/commands';
import { authorizeRequest, handleErrors as h, logUsers, pretendTyping, validateMessage } from '~/app/middlewares';
import {
  COMMAND_BOOKING_BY_ID,
  COMMAND_BOOKING_CREATE,
  COMMAND_BOOKING_MOVE,
  COMMAND_BOOKING_MOVE_IN_BATCH,
  COMMAND_BOOKINGS_ADDED_AFTER,
  COMMAND_BOOKINGS_ARRIVE_ON,
  COMMAND_BOOKINGS_NOT_PREPAID,
  COMMAND_BOOKINGS_PREPAID_EXPIRED,
  COMMAND_CLIENT_BY_ID,
  COMMAND_CLIENT_FIND_BY_NAME,
  COMMAND_DASHBOARD,
  COMMAND_SET_BOOKING_NOTE,
  COMMAND_SET_CLIENT_NOTE,
  COMMAND_SYNC,
  COMMAND_UNREAD_NOTIFICATIONS
} from '~/common/constants';
import env from '~/config/env';
import { log } from '~/config/logger';

const bot = new Telegraf(env.botToken);

bot.use(authorizeRequest);
bot.use(logUsers);
bot.on('text', validateMessage);
bot.on('text', pretendTyping);
bot.on('callback_query', pretendTyping);
bot.on('callback_query', h(handleCallbackQuery));

bot.start((ctx) => ctx.reply('Hello!'));
bot.command(COMMAND_BOOKINGS_ARRIVE_ON, h(parseCmdFindBookingsArrivedOn));
bot.command(COMMAND_BOOKINGS_ADDED_AFTER, h(parseCmdFetchBookingsAddedAfter));
bot.command(COMMAND_BOOKINGS_NOT_PREPAID, h(parseCmdFindBookingsNotPrepaid));
bot.command(COMMAND_BOOKINGS_PREPAID_EXPIRED, h(parseCmdRemindedExpired));
bot.command(COMMAND_BOOKING_BY_ID, h(parseCmdFindBookingById));
bot.command(COMMAND_BOOKING_CREATE, h(parseCmdCreateBooking));
bot.command(COMMAND_BOOKING_MOVE, h(parseCmdMvBooking));
bot.command(COMMAND_BOOKING_MOVE_IN_BATCH, h(parseCmdMvBookingInBatch));
bot.command(COMMAND_CLIENT_FIND_BY_NAME, h(parseCmdFindClient));
bot.command(COMMAND_CLIENT_BY_ID, h(parseCmdFindClientById));
bot.command(COMMAND_SYNC, h(parseCmdSynchronizeData));
bot.command(COMMAND_DASHBOARD, h(parseCmdDashboard));
bot.command(COMMAND_UNREAD_NOTIFICATIONS, h(parseCmdFindUnreadNotifications));
bot.command(COMMAND_SET_BOOKING_NOTE, h(parseCmdSetBookingNote));
bot.command(COMMAND_SET_CLIENT_NOTE, h(parseCmdSetClientNote));

bot.launch()
  .then(() => {
    log.info(`⚡️ Launched the bot. Environment: ${env.nodeEnv}`);
  })
  .catch((err: Error) => {
    log.error('☠ Error at launch ☠', err);
    process.exit(1);
  });

export default bot;
