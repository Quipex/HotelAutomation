import Router from 'koa-router';
import { routesV1 } from '~/common/maps';
import { getPathOf } from '~/domain/helpers/routes';
import BookingNotificationService from './BookingNotificationService';

const BookingNotificationController = new Router();

const { index$get, unread$get, read$patch } = routesV1.notifications;

BookingNotificationController.get(
  getPathOf(index$get),
  async (ctx) => {
    const { id_after: idMoreThan } = ctx.query as unknown as ReturnType<typeof index$get.getQueryParams>;
    ctx.body = await BookingNotificationService.getNotificationsWithIdMoreThan(idMoreThan);
  }
);

BookingNotificationController.get(
  getPathOf(unread$get),
  async (ctx) => {
    ctx.body = await BookingNotificationService.getUnreadNotifications();
  }
);

BookingNotificationController.patch(
  getPathOf(read$patch),
  async (ctx) => {
    const { notificationId } = ctx.request.body as ReturnType<typeof read$patch.getData>;
    await BookingNotificationService.markNotificationAsRead(notificationId);
    ctx.status = 200;
  }
);

export default BookingNotificationController;
