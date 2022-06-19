const prefix = (text) => `g${text}`;

const cancel = prefix('Deny');

function cbPayloadCancel() {
  return cancel;
}

export { cancel, cbPayloadCancel };
