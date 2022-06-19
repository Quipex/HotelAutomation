import { routesV1 } from '~/common/maps';
import { BookingNotificationDto } from '~/common/types';
import api from '../api';
import { rv1 } from './helpers';

const { index$get } = routesV1.notifications;

const getNotifications = async ({ idAfter }: { idAfter: number }) => {
  const {
    path, method, compactPath: { getQueryParams }
  } = rv1(index$get);
  const params = getQueryParams({ id_after: idAfter });
  return await api.call(path, {
    method,
    params
  }) as BookingNotificationDto[];
};

export default { getNotifications };
