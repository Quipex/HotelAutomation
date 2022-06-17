import Router from 'koa-router';
import { routesV1 } from '~/common/maps';
import { getPathOf } from '../helpers/routes';
import ClientsPmsService from './ClientService';

const ClientController = new Router();

const { byId$get, search$post } = routesV1.clients;

ClientController.post(
  getPathOf(search$post),
  async (ctx) => {
    const { name: requestName } = ctx.request.body as ReturnType<typeof search$post.getData>;
    if (requestName === undefined || requestName === null) {
      ctx.status = 400;
      ctx.body = { message: 'missing name' };
    }
    ctx.body = await ClientsPmsService.findClients(requestName);
  }
);

ClientController.get(
  getPathOf(byId$get),
  async (ctx) => {
    const { id } = ctx.params;
    ctx.body = await ClientsPmsService.findClientById(id);
  }
);

export default ClientController;
