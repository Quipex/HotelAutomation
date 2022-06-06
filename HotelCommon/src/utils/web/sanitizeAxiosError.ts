import { X_SEC_HEADER } from '~/constants';

const sanitizeHeaders = (headers) => {
  if (!Object.prototype.hasOwnProperty.call(headers, X_SEC_HEADER)) {
    return headers;
  }
  return {
    ...headers,
    [X_SEC_HEADER]: 'hidden'
  };
};

const sanitizeAxiosError = (error) => {
  const sanitized = { message: error.message };
  if (error.response) {
    Object.assign(sanitized, {
      response: {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      },
      context: 'The request was made and the server responded with a status code '
        + 'that falls out of the range of 2xx'
    });
  } else if (error.request) {
    Object.assign(sanitized, {
      request: {
        method: error.request.method,
        path: error.request.path,
        host: error.request.host,
        protocol: error.request.protocol,
        headers: sanitizeHeaders(error.request.headers)
      },
      context: 'The request was made but no response was received `error.request` is '
        + 'an instance of XMLHttpRequest in the browser and an instance of '
        + 'http.ClientRequest in node.js'
    });
  } else {
    Object.assign(sanitized, {
      context: 'Something happened in setting up the request that triggered an Error'
    });
  }
  Object.assign(sanitized, {
    config: {
      headers: sanitizeHeaders(error.config.headers),
      data: error.config.data,
      method: error.config.method,
      baseURL: error.config.baseURL,
      url: error.config.url
    }
  });
  return sanitized;
};

export { sanitizeAxiosError };
