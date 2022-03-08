import Router from 'koa-router';
import { routesV1 as v1 } from '~/common/maps';
import { resolveV1 as r } from '~/common/utils/routes';
import BookingController from './bookings/BookingController';
import ClientController from './clients/ClientController';

const appRouter = new Router();

appRouter
  .get(r(v1['/'].index$get).path, () => 'hello')
  .use(BookingController.routes())
  .use(ClientController.routes());

export default appRouter;
