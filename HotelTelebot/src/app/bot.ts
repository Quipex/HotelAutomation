import {
  parseCommandMoveBookingAndReply,
  parseCommandMoveBookingInBatchAndReply
} from '@commands/booking/booking_move';
import parseCommandFindBookingsAddedAfterAndReply from '@commands/booking/bookings_added';
import { parseCommandFindBookingsArrivedOnAndReply } from '@commands/booking/bookings_arrive';
import parseCommandFindBookingsByIdAndReply from '@commands/booking/bookings_by_id';
import parseCommandFindBookingsNotPrePayedAndReply from '@commands/booking/bookings_not_prepayed';
import findBookingsRemindedAndExpiredPrepaymentAndReply from '@commands/booking/bookings_not_prepayed_reminded_expired';
import parseCommandCreateBookingAndReply from '@commands/booking/create_booking';
import parseCommandFindClientByIdAndReply from '@commands/client/client_by_id';
import parseCommandFindClientAndReply from '@commands/client/find_client';
import synchronizeBookingsAndClientsAndReply from '@commands/synchronize_bookings_and_clients';
import { Telegraf } from 'telegraf';
import { handleCallbackQuery } from '~/app/callbacks';
import { authorizeRequest, handleErrors as h, logUsers, validateMessage } from '~/app/middlewares';
import { log } from '~/config/logger';
import env from '../config/env';

const bot = new Telegraf(env.botToken);

bot.use(authorizeRequest);
bot.use(logUsers);
bot.on('text', validateMessage);
bot.on('callback_query', h(handleCallbackQuery));

bot.start((ctx) => ctx.reply('Hello!'));

bot.command(['c', 'cl', 'client'], h(parseCommandFindClientAndReply));
bot.command('arrive', h(parseCommandFindBookingsArrivedOnAndReply));
bot.command('added', h(parseCommandFindBookingsAddedAfterAndReply));
bot.command('id', h(parseCommandFindBookingsByIdAndReply));
bot.command('cl_id', h(parseCommandFindClientByIdAndReply));
bot.command('sync', h(synchronizeBookingsAndClientsAndReply));
bot.command('create', h(parseCommandCreateBookingAndReply));
bot.command(['not_payed', 'prepay', 'prepayment', 'pp', 'npp'], h(parseCommandFindBookingsNotPrePayedAndReply));
bot.command(['pp_expired', 'expired'], h(findBookingsRemindedAndExpiredPrepaymentAndReply));
bot.command('mv', h(parseCommandMoveBookingAndReply));
bot.command('mv_batch', h(parseCommandMoveBookingInBatchAndReply));

bot.launch()
  .then(() => {
    log.info(`⚡️ Launched the bot. Environment: ${env.nodeEnv}`);
  })
  .catch((err: Error) => {
    log.error('☠ Error at launch ☠', err);
    process.exit(1);
  });

export default bot;
