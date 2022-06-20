import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { cancel } from './actions';
import { cancelAction } from './handlers';

registerActionHandler(cancel, cancelAction);
