import { BriefBooking } from '~/app/message_components/booking';
import { DATETIME_DAYOFWEEK_MOMENTJS } from '~/common/constants';
import { formatDate } from '~/common/utils/dates';
import { BookingNotificationDto } from '~/common/types';

const Notification = (notification: BookingNotificationDto): string => {
  const { changelogLines, booking, createdAt } = notification;
  const isNew = changelogLines.length === 0;
  const title = isNew ? '🟢 Новое бронирование' : '🟡 Изменение бронирования';
  const createdAtText = formatDate(createdAt, DATETIME_DAYOFWEEK_MOMENTJS);
  return `${title}\n`
    + `<i>${createdAtText}</i>\n\n`
    + `${BriefBooking(booking)}`;
};

export { Notification };
