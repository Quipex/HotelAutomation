import Router from 'koa-router';
import { routesV1 } from '~/common/maps';
import { getPathOf } from '~/domain/helpers/routes';
import BookingNotificationService from './BookingNotificationService';

const BookingNotificationController = new Router();

const { index$get } = routesV1.notifications;

BookingNotificationController.get(
  getPathOf(index$get),
  async (ctx) => {
    const { id_after: idMoreThan } = ctx.query as unknown as ReturnType<typeof index$get.getQueryParams>;
    ctx.body = await BookingNotificationService.getNotificationsWithIdMoreThan(idMoreThan);
  }
);

export default BookingNotificationController;
