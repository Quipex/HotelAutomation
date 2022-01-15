import bot from '~/app/bot';
import { parseCommandFindBookingsArrivedOnNotLivingAndSend } from '../booking/bookings_arrive';

const TEXT = 'Должны были заехать вчера и не отмечены как проживающие ⏰';

async function reportArrivedYesterday(chatId: string) {
  const titleMessage = await bot.telegram.sendMessage(chatId, TEXT);
  await parseCommandFindBookingsArrivedOnNotLivingAndSend(chatId, 'yesterday', titleMessage.message_id);
}

export default reportArrivedYesterday;
