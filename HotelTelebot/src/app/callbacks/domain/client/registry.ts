import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { clientBookings, clientDetails, clientRefresh } from './actions';
import { cbFindClientBookings, cbRefreshClient, cbSendClientDetails } from './handlers';

registerActionHandler(clientDetails, cbSendClientDetails);
registerActionHandler(clientRefresh, cbRefreshClient);
registerActionHandler(clientBookings, cbFindClientBookings);
