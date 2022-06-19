import { HotelDailyDashboardDto } from '~/common/types';
import { addToDate } from '~/common/utils/dates';
import BookingNotificationRepository from '~/domain/booking_notifications/BookingNotificationRepository';
import BookingRepository from '~/domain/bookings/BookingRepository';

const generateDailyStatus = async (date: Date): Promise<HotelDailyDashboardDto['tomorrow']> => {
  const cars = await BookingRepository.countCarsAtDate(date);
  const arrivals = await BookingRepository.countArrivalsAtDate(date);
  const departures = await BookingRepository.countDeparturesAtDate(date);
  const living = await BookingRepository.countLivingAtDate(date);
  return {
    cars,
    arrivals,
    departures,
    living
  };
};

const generateDailyDashboardReport = async (date: string): Promise<HotelDailyDashboardDto> => {
  const unreadNotifications = await BookingNotificationRepository.countUnreadNotifications();
  const today = new Date(date);
  const todayStatus = await generateDailyStatus(today);
  const tomorrow = addToDate({ date: today, amount: 1, unit: 'days' }).toDate();
  const tomorrowStatus = await generateDailyStatus(tomorrow);
  const newBookingsOverall = await BookingRepository.countAddedOn(
    { date: today, manuallyCreated: false }
  );
  const newBookingsManually = await BookingRepository.countAddedOn(
    { date: today, manuallyCreated: true }
  );
  const actuallyLivingButNotMarked = await BookingRepository.countLivingButNotMarked(today);
  const notPrepaidBookings = await BookingRepository.findNotPaidArriveAfter(today);
  const overall = notPrepaidBookings.length;
  const notReminded = notPrepaidBookings.filter((booking) => booking.prepaymentRemindings.length === 0).length;
  return {
    unreadNotifications,
    tomorrow: tomorrowStatus,
    today: { ...todayStatus, newBookingsOverall, newBookingsManually },
    actuallyLivingButNotMarked,
    noPrepaidBookings: {
      notReminded,
      overall,
      reminded: overall - notReminded
    }
  };
};

export default { generateDailyDashboardReport };
