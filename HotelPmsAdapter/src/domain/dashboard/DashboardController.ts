import Router from 'koa-router';
import { routesV1 } from '~/common/maps';
import { getPathOf } from '~/domain/helpers/routes';
import DashboardService from './DashboardService';

const DashboardController = new Router();

const { index$get } = routesV1.dashboard;

DashboardController.get(
  getPathOf(index$get),
  async (ctx) => {
    const { date } = ctx.query as unknown as ReturnType<typeof index$get.getQueryParams>;
    ctx.body = await DashboardService.generateDailyDashboardReport(date);
  }
);

export default DashboardController;
