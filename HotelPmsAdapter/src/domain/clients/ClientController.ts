import Router from 'koa-router';
import { routesV1 } from '~/common/maps';
import { QueryParams } from '~/common/types';
import { getPathOf } from '../helpers/routes';
import ClientService from './ClientService';

const ClientController = new Router();

const { byId$get, search$post, setNote$patch, note$get } = routesV1.clients;

ClientController.post(
  getPathOf(search$post),
  async (ctx) => {
    const { name: requestName } = ctx.request.body as ReturnType<typeof search$post.getData>;
    if (requestName === undefined || requestName === null) {
      ctx.status = 400;
      ctx.body = { message: 'missing name' };
    }
    ctx.body = await ClientService.findClients(requestName);
  }
);

ClientController.get(
  getPathOf(byId$get),
  async (ctx) => {
    const { id } = ctx.params;
    ctx.body = await ClientService.findClientById(id);
  }
);

ClientController.patch(
  getPathOf(setNote$patch),
  async (ctx) => {
    const { id, noteText } = ctx.request.body as ReturnType<typeof setNote$patch.getData>;
    await ClientService.setNote(id, noteText);
    ctx.status = 200;
  }
);

ClientController.get(
  getPathOf(note$get),
  async (ctx) => {
    const { id } = ctx.query as unknown as QueryParams<typeof note$get.getQueryParams>;
    ctx.body = await ClientService.getNote(id);
  }
);

export default ClientController;
