import { id as getRequestId } from 'cls-rtracer';

function appendRequestIdIfPresent(text) {
  const requestId = getRequestId();
  return requestId ? `[${requestId}] ${text}` : text;
}

export { appendRequestIdIfPresent };
