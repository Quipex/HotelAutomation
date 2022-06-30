import Router from 'koa-router';
import { routesV1 } from '~/common/maps';
import { QueryParams } from '~/common/types';
import { getPathOf } from '~/domain/helpers/routes';
import RoomService from './RoomService';

const { byNumber$get, setNote$patch, note$get } = routesV1.rooms;

const RoomController = new Router();

RoomController.get(
  getPathOf(byNumber$get),
  async (ctx) => {
    const { number } = ctx.params;
    ctx.body = await RoomService.findRoomByNumber(Number(number));
  }
);

RoomController.get(
  getPathOf(note$get),
  async (ctx) => {
    const { roomNumber } = ctx.query as unknown as QueryParams<typeof note$get.getQueryParams>;
    ctx.body = await RoomService.getNote(roomNumber);
  }
);

RoomController.patch(
  getPathOf(setNote$patch),
  async (ctx) => {
    const { roomNumber, noteText } = ctx.request.body as ReturnType<typeof setNote$patch.getData>;
    await RoomService.setNote(roomNumber, noteText);
    ctx.status = 200;
  }
);

export default RoomController;
