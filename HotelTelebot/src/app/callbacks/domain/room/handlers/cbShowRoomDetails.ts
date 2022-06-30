import { findRoomByNumberAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbShowRoomDetails: CallbackHandler = async ({ ctx, messageId, cbPayloadArray }) => {
  const [, roomNumber] = cbPayloadArray;
  await findRoomByNumberAndReply(ctx, roomNumber, messageId);
  await ctx.answerCbQuery();
};

export { cbShowRoomDetails };
