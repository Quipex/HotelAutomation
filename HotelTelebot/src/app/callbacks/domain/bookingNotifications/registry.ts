import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { bnRead } from './actions';
import { cbReadBookingNotification } from './handlers';

registerActionHandler(bnRead, cbReadBookingNotification);
