import {
  parseCommandMoveBookingAndReply,
  parseCommandMoveBookingInBatchAndReply
} from '@commands/booking/booking_move';
import parseCommandFindBookingsAddedAfterAndReply from '@commands/booking/bookings_added';
import { parseCommandFindBookingsArrivedOnAndReply } from '@commands/booking/bookings_arrive';
import { parseCommandFindBookingsByIdAndReply } from '@commands/booking/bookings_by_id';
import parseCommandFindBookingsNotPrePayedAndReply from '@commands/booking/bookings_not_prepayed';
import findBookingsRemindedAndExpiredPrepaymentAndReply from '@commands/booking/bookings_not_prepayed_reminded_expired';
import parseCommandCreateBookingAndReply from '@commands/booking/create_booking';
import parseCommandFindClientByIdAndReply from '@commands/client/client_by_id';
import parseCommandFindClientAndReply from '@commands/client/find_client';
import synchronizeBookingsAndClientsAndReply from '@commands/synchronize_bookings_and_clients';
import { Telegraf } from 'telegraf';
import { handleCallbackQuery } from '~/app/callbacks';
import { authorizeRequest, handleErrors as h, logUsers, validateMessage } from '~/app/middlewares';
import {
  COMMAND_BOOKING_BY_ID,
  COMMAND_BOOKINGS_ADDED_AFTER,
  COMMAND_BOOKINGS_ARRIVE_ON,
  COMMAND_CLIENT_BY_ID,
  COMMAND_CREATE,
  COMMAND_FIND_CLIENT,
  COMMAND_MOVE,
  COMMAND_MOVE_IN_BATCH,
  COMMAND_NOT_PREPAID,
  COMMAND_PREPAID_EXPIRED,
  COMMAND_SYNC
} from '~/common/constants';
import env from '~/config/env';
import { log } from '~/config/logger';

const bot = new Telegraf(env.botToken);

bot.use(authorizeRequest);
bot.use(logUsers);
bot.on('text', validateMessage);
bot.on('callback_query', h(handleCallbackQuery));

bot.start((ctx) => ctx.reply('Hello!'));

bot.command(COMMAND_FIND_CLIENT, h(parseCommandFindClientAndReply));
bot.command(COMMAND_BOOKINGS_ARRIVE_ON, h(parseCommandFindBookingsArrivedOnAndReply));
bot.command(COMMAND_BOOKINGS_ADDED_AFTER, h(parseCommandFindBookingsAddedAfterAndReply));
bot.command(COMMAND_BOOKING_BY_ID, h(parseCommandFindBookingsByIdAndReply));
bot.command(COMMAND_CLIENT_BY_ID, h(parseCommandFindClientByIdAndReply));
bot.command(COMMAND_SYNC, h(synchronizeBookingsAndClientsAndReply));
bot.command(COMMAND_CREATE, h(parseCommandCreateBookingAndReply));
bot.command(COMMAND_NOT_PREPAID, h(parseCommandFindBookingsNotPrePayedAndReply));
bot.command(COMMAND_PREPAID_EXPIRED, h(findBookingsRemindedAndExpiredPrepaymentAndReply));
bot.command(COMMAND_MOVE, h(parseCommandMoveBookingAndReply));
bot.command(COMMAND_MOVE_IN_BATCH, h(parseCommandMoveBookingInBatchAndReply));

bot.launch()
  .then(() => {
    log.info(`⚡️ Launched the bot. Environment: ${env.nodeEnv}`);
  })
  .catch((err: Error) => {
    log.error('☠ Error at launch ☠', err);
    process.exit(1);
  });

export default bot;
