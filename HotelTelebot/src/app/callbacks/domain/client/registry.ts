import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { clientBookings, clientDetails, clientRefresh, clientShowNote, clientClearNote } from './actions';
import {
  cbClearClientNote,
  cbFindClientBookings,
  cbRefreshClient,
  cbSendClientDetails,
  cbShowClientNoteMenu
} from './handlers';

registerActionHandler(clientDetails, cbSendClientDetails);
registerActionHandler(clientRefresh, cbRefreshClient);
registerActionHandler(clientBookings, cbFindClientBookings);
registerActionHandler(clientShowNote, cbShowClientNoteMenu);
registerActionHandler(clientClearNote, cbClearClientNote);
