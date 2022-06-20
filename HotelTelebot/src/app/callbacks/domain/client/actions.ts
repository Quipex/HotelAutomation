const prefix = (text) => `c${text}`;

const clientDetails = prefix('D');

function cbPayloadClientDetails(clientId: string) {
  return `${clientDetails}|${clientId}`;
}

const clientBookings = prefix('B');

function cbPayloadClientBookings(clientId: string) {
  return `${clientBookings}|${clientId}`;
}

const clientRefresh = prefix('Rf');

function cbPayloadClientRefresh(clientId: string) {
  return `${clientRefresh}|${clientId}`;
}

export {
  cbPayloadClientBookings,
  clientRefresh,
  cbPayloadClientRefresh,
  clientBookings,
  clientDetails,
  cbPayloadClientDetails
};
