type DailyStatus = {
  arrivals: number,
  departures: number,
  living: number,
  cars: number
};

type HotelDailyDashboardDto = {
  today: DailyStatus & {
    newBookingsOverall: number,
    newBookingsManually: number
  },
  tomorrow: DailyStatus,
  unreadNotifications: number,
  noPrepaidBookings: {
    overall: number,
    reminded: number,
    notReminded: number
  }
  actuallyLivingButNotMarked: number,
  synchronizationTime: string
};

export type { HotelDailyDashboardDto };
