import { fetchRoomNoteAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';

const cbShowRoomNoteMenu: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, roomNumber] = cbPayloadArray;
  await fetchRoomNoteAndReply(ctx, { roomNumber, originalMessageId: messageId });
  await ctx.answerCbQuery();
};

export { cbShowRoomNoteMenu };
