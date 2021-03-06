import { routesV1 } from '~/common/maps';
import { BookingNotificationDto } from '~/common/types';
import api from '../api';
import { rv1 } from './helpers';

const { index$get, unread$get, read$patch } = routesV1.notifications;

const getNotifications = async ({ idAfter }: { idAfter: number }) => {
  const {
    path, method, compactPath: { getQueryParams }
  } = rv1(index$get);
  const params = getQueryParams({ id_after: idAfter });
  return await api.call(path, { method, params }) as BookingNotificationDto[];
};

const getUnreadNotifications = async () => {
  const { path, method } = rv1(unread$get);
  return await api.call(path, { method }) as BookingNotificationDto[];
};

const readNotificationById = async (notificationId: number) => {
  const { path, method, compactPath: { getData } } = rv1(read$patch);
  const data = getData({ notificationId });
  await api.call(path, { method, data });
};

export default { getNotifications, getUnreadNotifications, readNotificationById };
