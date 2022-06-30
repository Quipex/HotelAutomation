import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { roomClearNote, roomDetails, roomShowNote } from './actions';
import { cbClearRoomNote, cbShowRoomDetails, cbShowRoomNoteMenu } from './handlers';

registerActionHandler(roomShowNote, cbShowRoomNoteMenu);
registerActionHandler(roomClearNote, cbClearRoomNote);
registerActionHandler(roomDetails, cbShowRoomDetails);
