import { composeCallbackData } from '~@callbacks/helpers';

const prefix = (text) => `nb${text}`;

const bnRead = prefix('Read');

const cbPayloadBnRead = (notificationId: number) => {
  return composeCallbackData(bnRead, notificationId);
};

export { bnRead, cbPayloadBnRead };
