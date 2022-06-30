import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { clientBookings, clientDetails, clientRefresh, clientShowNote, clientClearNote } from './actions';
import {
  cbClearClientNote,
  cbFindClientBookings,
  cbRefreshClient,
  cbShowClientDetails,
  cbShowClientNoteMenu
} from './handlers';

registerActionHandler(clientDetails, cbShowClientDetails);
registerActionHandler(clientRefresh, cbRefreshClient);
registerActionHandler(clientBookings, cbFindClientBookings);
registerActionHandler(clientShowNote, cbShowClientNoteMenu);
registerActionHandler(clientClearNote, cbClearClientNote);
