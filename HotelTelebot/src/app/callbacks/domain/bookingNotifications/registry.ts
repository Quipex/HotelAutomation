import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { bnRead } from './actions';
import { readBookingNotification } from './handlers';

registerActionHandler(bnRead, readBookingNotification);
