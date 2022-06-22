import { Divider } from '~/app/message_components/common';
import { DATETIME_MOMENTJS } from '~/common/constants';
import { HotelDailyDashboardDto } from '~/common/types';
import { addToDate, formatDate, getRelevantDateText } from '~/common/utils/dates';

const b = (text) => `<b>${text}</b>`;

const important = (count: number) => {
  const icon = count === 0 ? ' ☑' : '❗';
  return `${b(count)}${icon}`;
};

const notImportant = (count: number) => {
  const icon = count === 0 ? ' ☑' : '❕';
  return `${b(count)}${icon}`;
};

const Dashboard = (
  {
    today,
    tomorrow,
    noPrepaidBookings,
    actuallyLivingButNotMarked,
    unreadNotifications,
    synchronizationTime
  }: HotelDailyDashboardDto,
  date: Date
) => {
  const todayTitle = getRelevantDateText(date);
  const theNextDate = addToDate({ date, unit: 'days', amount: 1 }).toDate();
  const tomorrowTitle = getRelevantDateText(theNextDate);
  const syncTimeText = formatDate(new Date(synchronizationTime), DATETIME_MOMENTJS);

  return [
    '<i>Последняя синхронизация (с внешним сервером)</i>',
    `<i>${syncTimeText}</i>`,
    '',
    `<b>${todayTitle}</b>`,
    `${b(today.arrivals)} заезд 📥 | ${b(today.departures)} выезд 📤`,
    `${b(today.living)} проживает 🛌 | ${b(today.cars)} машин 🚗`,
    `${b(today.newBookingsOverall)} бронирований 🆕 (${b(today.newBookingsManually)} вручную ✍)`,
    Divider(),
    `<b>${tomorrowTitle}</b>`,
    `${b(tomorrow.arrivals)} заезд 📥 | ${b(tomorrow.departures)} выезд 📤`,
    `${b(tomorrow.living)} проживает 🛌 | ${b(tomorrow.cars)} машин 🚗`,
    Divider(),
    `${important(unreadNotifications)} уведомлений (непр.) 🔔`,
    Divider(),
    `${notImportant(noPrepaidBookings.overall)} бронирований без предоплаты`,
    `${important(noPrepaidBookings.remindedAndExpired)} человек, которым напомнили и они не оплатили (прошло время ⏲)`,
    `${notImportant(noPrepaidBookings.remindedNotExpired)} человек, которым напомнили `
    + 'и они не оплатили (еще есть время)',
    `${important(noPrepaidBookings.notReminded)} человек, которым надо напомнить за предоплату`,
    Divider(),
    `${important(actuallyLivingButNotMarked)} проживающих не отмеченных как проживающие`
  ].join('\n');
};

export default Dashboard;
