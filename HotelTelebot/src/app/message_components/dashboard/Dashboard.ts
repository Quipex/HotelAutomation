import { Divider } from '~/app/message_components/common';
import { DATE_SHORT, DATETIME_MOMENTJS } from '~/common/constants';
import { HotelDailyDashboardDto } from '~/common/types';
import { addToDate, formatDate, subtractFromDate } from '~/common/utils/dates';

const b = (text) => `<b>${text}</b>`;

const important = (count: number) => {
  const icon = count === 0 ? ' ☑' : '❗';
  return `${b(count)}${icon}`;
};

const notImportant = (count: number) => {
  const icon = count === 0 ? ' ☑' : '❕';
  return `${b(count)}${icon}`;
};

const getRelevantTitle = (date: Date): string => {
  const now = new Date();
  const shortDate = formatDate(date, DATE_SHORT);
  const isToday = formatDate(date) === formatDate(now);
  if (isToday) {
    return `Сегодня (${shortDate})`;
  }
  const isTomorrow = formatDate(now) === formatDate(subtractFromDate({ date, unit: 'days', amount: 1 }));
  if (isTomorrow) {
    return `Завтра (${shortDate})`;
  }
  const isYesterday = formatDate(now) === formatDate(addToDate({ date, unit: 'days', amount: 1 }));
  if (isYesterday) {
    return `Вчера (${shortDate})`;
  }
  return `Дата ${shortDate}`;
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
  const todayTitle = getRelevantTitle(date);
  const theNextDate = addToDate({ date, unit: 'days', amount: 1 }).toDate();
  const tomorrowTitle = getRelevantTitle(theNextDate);
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
    `${important(noPrepaidBookings.reminded)} человек, которым напомнили и они не оплатили`,
    `${important(noPrepaidBookings.notReminded)} человек, которым надо напомнить за предоплату`,
    `${important(actuallyLivingButNotMarked)} проживающих не отмеченных как проживающие`
  ].join('\n');
};

export default Dashboard;
