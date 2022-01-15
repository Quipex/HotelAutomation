import { Context } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/telegram-types';
import { log } from '~/config/logger';
import {
  bookingDetails,
  bookingLivingAsk,
  bookingLivingConfirm,
  bookingMoveList,
  bookingPrePaidAsk,
  bookingPrePaidConfirm,
  bookingRefresh,
  bookingRemindedPrepayment,
  cancel,
  clientBookings,
  clientDetails,
  clientRefresh
} from './callback_actions';
import askForConfirmation, { cancelAction, extractMessageId } from './handlers/askConfirmation';
import { confirmBookingAndReply } from './handlers/booking/confirmBooking';
import { confirmLivingAndReply } from './handlers/booking/confirmLiving';
import { replyWithMoveBookingUsage } from './handlers/booking/moveBookingUsage';
import { refreshBooking } from './handlers/booking/refreshBooking';
import { setRemindedPrepaymentAndReply } from './handlers/booking/remindedPrepayment';
import { sendBookingDetails } from './handlers/booking/sendBookingDetails';
import { findClientBookings } from './handlers/client/findClientBookings';
import { refreshClient } from './handlers/client/refreshClient';
import { sendClientDetails } from './handlers/client/sendClientDetails';

async function handleCallbackQueries(ctx: Context) {
  const { data, message: { message_id: messageId } } = ctx.update.callback_query as CallbackQuery;
  await handleCallbackQuery(ctx, { callbackData: data.split('|'), message_id: messageId });
}

async function handleCallbackQuery(ctx: Context, callback: { callbackData: string[]; message_id: number; }) {
  log.debug('Callback data at handler entry', { callback });
  const callbackDataArray = callback.callbackData;
  const action = callbackDataArray[0];
  const firstArgument = callbackDataArray[1];
  const lastArgument = callbackDataArray[callbackDataArray.length - 1];
  switch (action) {
    case cancel: {
      await cancelAction(ctx);
      break;
    }
    case bookingDetails: {
      await sendBookingDetails(ctx, firstArgument, callback.message_id);
      break;
    }
    case bookingPrePaidAsk: {
      await askForConfirmation({
        ctx,
        action: bookingPrePaidConfirm,
        args: [firstArgument],
        messageId: callback.message_id,
        confirmationMessage: 'Предоплата'
      });
      break;
    }
    case bookingPrePaidConfirm: {
      await confirmBookingAndReply(ctx, firstArgument, extractMessageId(lastArgument));
      break;
    }
    case bookingRemindedPrepayment: {
      await setRemindedPrepaymentAndReply(ctx, firstArgument);
      break;
    }
    case bookingLivingAsk: {
      await askForConfirmation({
        ctx,
        action: bookingLivingConfirm,
        args: [firstArgument],
        messageId: callback.message_id,
        confirmationMessage: 'Проживание'
      });
      break;
    }
    case bookingLivingConfirm: {
      await confirmLivingAndReply(ctx, firstArgument, extractMessageId(lastArgument));
      break;
    }
    case bookingRefresh: {
      await refreshBooking(ctx, firstArgument);
      break;
    }
    case clientDetails: {
      await sendClientDetails(ctx, firstArgument, callback.message_id);
      break;
    }
    case clientRefresh: {
      await refreshClient(ctx, firstArgument);
      break;
    }
    case clientBookings: {
      await findClientBookings(ctx, firstArgument, callback.message_id);
      break;
    }
    case bookingMoveList: {
      await replyWithMoveBookingUsage(ctx, firstArgument, callback.message_id);
      break;
    }
    default: {
      log.warn('Unexpected callback query action', { action, dataArray: callbackDataArray, callback });
    }
  }
}

export default handleCallbackQueries;
