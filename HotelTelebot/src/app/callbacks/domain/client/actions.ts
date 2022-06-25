import { composeCallbackData } from '~@callbacks/helpers';

const prefix = (text) => `c${text}`;

const clientDetails = prefix('D');
const cbPayloadClientDetails = (clientId: string) => `${clientDetails}|${clientId}`;

const clientBookings = prefix('B');
const cbPayloadClientBookings = (clientId: string) => `${clientBookings}|${clientId}`;

const clientRefresh = prefix('Rf');
const cbPayloadClientRefresh = (clientId: string) => `${clientRefresh}|${clientId}`;

const clientShowNote = prefix('Note');
const cbPayloadClientShowNote = (clientId: string) => composeCallbackData(clientShowNote, clientId);

const clientClearNote = prefix('RmNote');
const cbPayloadClientClearNote = (clientId: string) => {
  return composeCallbackData(clientClearNote, clientId);
};

export {
  cbPayloadClientBookings,
  clientRefresh,
  cbPayloadClientRefresh,
  clientBookings,
  clientDetails,
  cbPayloadClientDetails,
  clientShowNote,
  cbPayloadClientShowNote,
  clientClearNote,
  cbPayloadClientClearNote
};
