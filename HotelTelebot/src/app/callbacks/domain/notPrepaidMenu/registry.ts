import { registerActionHandler } from '~@callbacks/CallbackHandler';
import { npmExpired, npmNeedReminding, npmNotExpired, npmOverall } from './actions';
import { cbReplyExpired, cbReplyNeedReminding, cbReplyNotExpired, cbReplyOverall } from './handlers';

registerActionHandler(npmOverall, cbReplyOverall);
registerActionHandler(npmNeedReminding, cbReplyNeedReminding);
registerActionHandler(npmExpired, cbReplyExpired);
registerActionHandler(npmNotExpired, cbReplyNotExpired);
