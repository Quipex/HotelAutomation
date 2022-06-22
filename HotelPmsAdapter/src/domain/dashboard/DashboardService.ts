import { HotelDailyDashboardDto } from '~/common/types';
import { addToDate } from '~/common/utils/dates';
import localDb from '~/config/localDb';
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

const generateDailyDashboardReport = async (dateAsString: string): Promise<HotelDailyDashboardDto> => {
  const date = new Date(dateAsString);
  await localDb.read();
  const synchronizationTime = localDb.data.lastSynchronization;
  const unreadNotifications = await BookingNotificationRepository.countUnreadNotifications();
  const todayStatus = await generateDailyStatus(date);
  const tomorrow = addToDate({ date, amount: 1, unit: 'days' }).toDate();
  const tomorrowStatus = await generateDailyStatus(tomorrow);
  const newBookingsOverall = await BookingRepository.countAddedOn(
    { date, manuallyCreated: false }
  );
  const newBookingsManually = await BookingRepository.countAddedOn(
    { date, manuallyCreated: true }
  );
  const actuallyLivingButNotMarked = await BookingRepository.countLivingButNotMarked(date);

  const today = new Date();
  const overall = await BookingRepository.countNotPaidArriveAfter(today);
  const notReminded = await BookingRepository.countNotRemindedNoPrepaid(today);
  const remindedNotExpired = await BookingRepository.countRemindedNotExpired(today);
  const remindedAndExpired = await BookingRepository.countRemindedAndExpired(today);

  return {
    unreadNotifications,
    tomorrow: tomorrowStatus,
    today: { ...todayStatus, newBookingsOverall, newBookingsManually },
    actuallyLivingButNotMarked,
    noPrepaidBookings: {
      notReminded,
      overall,
      remindedNotExpired,
      remindedAndExpired
    },
    synchronizationTime
  };
};

export default { generateDailyDashboardReport };
