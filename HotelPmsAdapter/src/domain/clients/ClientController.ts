import Router from 'koa-router';
import { routesV1 } from '~/common/maps';
import ClientsPmsService from './ClientsPmsService';
import {getPathOf} from '../common';

const clients = new Router();

const { byId$get, search$post, sync$put } = routesV1.clients;

clients.put(getPathOf(sync$put), async (ctx) => {
  await ClientsPmsService.getClients();
  ctx.status = 200;
});

clients.post(getPathOf(search$post), async (ctx) => {
  const { name: requestName } = ctx.request.body as ReturnType<typeof search$post.getData>;
  if (requestName === undefined || requestName === null) {
    ctx.status = 400;
    ctx.body = { message: 'missing name' };
  }
  ctx.body = await ClientsPmsService.findClients(requestName);
});

clients.get(getPathOf(byId$get), async (ctx) => {
  const { id } = ctx.params;
  ctx.body = await ClientsPmsService.findClientById(id);
});

export default clients;
