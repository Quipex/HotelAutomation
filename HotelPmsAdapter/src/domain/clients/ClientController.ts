import Router from 'koa-router';
import ClientsPmsService from './ClientsPmsService';

const clients = new Router();

clients.put('/sync', async (ctx) => {
  await ClientsPmsService.getClients();
  ctx.status = 200;
});

clients.post('/search', async (ctx) => {
  const requestName = ctx.request.body.name;
  if (requestName === undefined || requestName === null) {
    ctx.status = 400;
    ctx.body = { message: 'missing name' };
  }
  ctx.body = await ClientsPmsService.findClients(requestName);
});

clients.get('/:id', async (ctx) => {
  const { id } = ctx.params;
  ctx.body = await ClientsPmsService.findClientById(id);
});

export default clients;
