import { mapPmscloudBooking2TransientBooking } from '~/common/mappings/cloud_provider/pmscloud';
import { BookingPmscloud } from '~/common/types';
import { BookingTransientModel } from '~/common/types/domain/transient_models';
import { dateToUnixSeconds } from '~/common/utils/dates';
import { encodeObjectAsUrl } from '~/common/utils/url';
import api from '../api';
import { and, SearchFilter, SearchParam } from '../search';

function datesFilters(startTime: number, endTime: number): SearchParam[] {
  return [
    {
      field: 'startDate',
      comparison: 'lte',
      type: 'date',
      // this is not a mistake, we invert dates on purpose
      value: String(endTime)
    },
    {
      field: 'endDate',
      comparison: 'gte',
      type: 'date',
      // this is not a mistake, we invert dates on purpose
      value: String(startTime)
    }
  ];
}

function composeBookingsUrlWithFilter(filter: SearchFilter) {
  const urlEncodedFilter = encodeObjectAsUrl(filter);
  return `/frontDesk?_dc=${Date.now()}&withFilter=${urlEncodedFilter}&ajax_request=true`;
}

const fetchBookingsByDates = async (startDate: Date, endDate: Date): Promise<BookingTransientModel[]> => {
  const bookingsByDatesPath = composeBookingsUrlWithFilter(
    and(...datesFilters(dateToUnixSeconds(startDate), dateToUnixSeconds(endDate)))
  );
  const pmscloudBookings = (await api.get(bookingsByDatesPath, { extra: { limit: 100 } })) as BookingPmscloud[];
  return pmscloudBookings.map(mapPmscloudBooking2TransientBooking);
};

export { fetchBookingsByDates };
