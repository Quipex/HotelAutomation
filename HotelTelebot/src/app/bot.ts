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
import { Context, Telegraf } from 'telegraf';
import { log } from '~/config/logger';
import handleCallbackQueries from './callbacks';
import env from './env';
import validateMessage from './middlewares/message_validation';
import security from './middlewares/security';

const bot = new Telegraf(env.botToken);

bot.catch(async (err, ctx: Context) => {
  await ctx.replyWithHTML('☠ Got error ☠\n\n'
    + `<code>${err.message}</code>`);
  log.error(`Got an error for update of type '${ctx.updateType}':`, err);
});
bot.use(security);
bot.on('text', validateMessage);
bot.on('callback_query', handleCallbackQueries);

bot.start((ctx) => ctx.reply('Hello!'));

bot.command(['c', 'cl', 'client'], parseCommandFindClientAndReply);
bot.command('arrive', parseCommandFindBookingsArrivedOnAndReply);
bot.command('added', parseCommandFindBookingsAddedAfterAndReply);
bot.command('id', parseCommandFindBookingsByIdAndReply);
bot.command('cl_id', parseCommandFindClientByIdAndReply);
bot.command('sync', synchronizeBookingsAndClientsAndReply);
bot.command('create', parseCommandCreateBookingAndReply);
bot.command(['not_payed', 'prepay', 'prepayment', 'pp', 'npp'], parseCommandFindBookingsNotPrePayedAndReply);
bot.command(['pp_expired', 'expired'], findBookingsRemindedAndExpiredPrepaymentAndReply);
bot.command('mv', parseCommandMoveBookingAndReply);
bot.command('mv_batch', parseCommandMoveBookingInBatchAndReply);

bot.launch()
  .then(() => {
    log.info('⚡ Launched bot');
  })
  .catch((err: Error) => {
    log.error('Error at launch', err);
    process.exit(1);
  });

export default bot;
