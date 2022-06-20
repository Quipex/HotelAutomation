import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { clientBookings, clientDetails, clientRefresh } from './actions';
import { findClientBookings, refreshClient, sendClientDetails } from './handlers';

registerActionHandler(clientDetails, sendClientDetails);
registerActionHandler(clientRefresh, refreshClient);
registerActionHandler(clientBookings, findClientBookings);
