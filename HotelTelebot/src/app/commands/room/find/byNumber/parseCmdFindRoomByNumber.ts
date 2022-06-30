import { Context } from 'telegraf';
import { findRoomByNumberAndReply } from '~/app/commands';

const parseCmdFindRoomByNumber = async (ctx: Context) => {
  const [, roomNumber] = ctx.message.text.split(' ');

  await findRoomByNumberAndReply(ctx, roomNumber);
};

export { parseCmdFindRoomByNumber };
