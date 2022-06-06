import { ORGANIZATION_ID } from '~/common/constants/cloud_provider/easyms';
import { mapEasymsBooking2BookingModel } from '~/common/mappings/cloud_provider/easyms';
import { OrderEasyms } from '~/common/types';
import { dateToUnixMilliseconds } from '~/common/utils/dates';
import { CloudProvider } from '~/integrations/CloudProvider.interface';
import api from '../api';

const fetchBookingsByDates: CloudProvider['fetchBookingsByDates'] = async (startDate, endDate) => {
  const startTime = dateToUnixMilliseconds(startDate);
  const endTime = dateToUnixMilliseconds(endDate);
  const easymsOrders = (await api.get('api/orders', {
    requestConfig: {
      params: {
        startTime,
        endTime,
        organizationId: ORGANIZATION_ID
      }
    }
  })) as OrderEasyms[];
  return easymsOrders.flatMap(mapEasymsBooking2BookingModel);
};

export { fetchBookingsByDates };
