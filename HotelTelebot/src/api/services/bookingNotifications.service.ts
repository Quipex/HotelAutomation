import { routesV1 } from '~/common/maps';
import { BookingNotificationDto } from '~/common/types';
import api from '../api';
import { rv1 } from './helpers';

const getNotifications = async ({ idAfter }: { idAfter: number }) => {
  const { path, method, compactPath: { getQueryParams } } = rv1(routesV1.notifications.index$get);
  const params = getQueryParams({ id_after: idAfter });
  return await api.call(path, {
    method,
    params
  }) as BookingNotificationDto[];
};

export default { getNotifications };
