import { routesV1 } from '~/common/maps';
import { HotelDailyDashboardDto } from '~/common/types';
import api from '../api';
import { rv1 } from './helpers';

const { index$get } = routesV1.dashboard;

const getDailyStatus = async (date: string): Promise<HotelDailyDashboardDto> => {
  const {
    path, method, compactPath: { getQueryParams }
  } = rv1(index$get);
  const params = getQueryParams({ date });
  return await api.call(path, {
    method,
    params
  }) as HotelDailyDashboardDto;
};

export default { getDailyStatus };
