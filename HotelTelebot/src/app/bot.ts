import { Telegraf } from 'telegraf';
import { handleCallbackQuery } from '~/app/callbacks';
import {
  findBookingsRemindedAndExpiredPrepayment,
  parseCommandCreateBookingAndReply,
  parseCommandDashboardAndReply,
  parseCommandFindBookingsAddedAfterAndReply,
  parseCommandFindBookingsArrivedOnAndReply,
  parseCommandFindBookingsByIdAndReply,
  parseCommandFindBookingsNotPrePayedAndReply,
  parseCommandFindClientAndReply,
  parseCommandFindClientByIdAndReply,
  parseCommandMoveBookingAndReply,
  parseCommandMoveBookingInBatchAndReply,
  replyWithUnreadNotifications,
  synchronizeDataAndSendStatus
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
bot.command(COMMAND_BOOKINGS_ARRIVE_ON, h(parseCommandFindBookingsArrivedOnAndReply));
bot.command(COMMAND_BOOKINGS_ADDED_AFTER, h(parseCommandFindBookingsAddedAfterAndReply));
bot.command(COMMAND_BOOKINGS_NOT_PREPAID, h(parseCommandFindBookingsNotPrePayedAndReply));
bot.command(COMMAND_BOOKINGS_PREPAID_EXPIRED, h(findBookingsRemindedAndExpiredPrepayment));
bot.command(COMMAND_BOOKING_BY_ID, h(parseCommandFindBookingsByIdAndReply));
bot.command(COMMAND_BOOKING_CREATE, h(parseCommandCreateBookingAndReply));
bot.command(COMMAND_BOOKING_MOVE, h(parseCommandMoveBookingAndReply));
bot.command(COMMAND_BOOKING_MOVE_IN_BATCH, h(parseCommandMoveBookingInBatchAndReply));
bot.command(COMMAND_CLIENT_FIND_BY_NAME, h(parseCommandFindClientAndReply));
bot.command(COMMAND_CLIENT_BY_ID, h(parseCommandFindClientByIdAndReply));
bot.command(COMMAND_SYNC, h(synchronizeDataAndSendStatus));
bot.command(COMMAND_DASHBOARD, h(parseCommandDashboardAndReply));
bot.command(COMMAND_UNREAD_NOTIFICATIONS, h(replyWithUnreadNotifications));

bot.launch()
  .then(() => {
    log.info(`⚡️ Launched the bot. Environment: ${env.nodeEnv}`);
  })
  .catch((err: Error) => {
    log.error('☠ Error at launch ☠', err);
    process.exit(1);
  });

export default bot;
