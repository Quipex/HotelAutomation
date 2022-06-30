import { fetchRoomNoteAndReply } from '~/app/commands';
import { CallbackHandler } from '~@callbacks/CallbackHandler';
import { RoomService } from '~@services';

const cbClearRoomNote: CallbackHandler = async ({ ctx, cbPayloadArray, messageId }) => {
  const [, roomNumber] = cbPayloadArray;
  await RoomService.setNote(roomNumber, null);
  await ctx.answerCbQuery('Очищено ✅');
  await ctx.deleteMessage(messageId);
  await fetchRoomNoteAndReply(ctx, { roomNumber });
};

export { cbClearRoomNote };
