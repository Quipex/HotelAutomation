import fetch from '~/common/utils/fetch';
import env from '~/config/env';
import { log } from '~/config/logger';
import { isEpochExpired } from '~/common/utils/dates';
import { decodeBase64String } from '~/common/utils/encoding';

type SecurityContext = {
  token: null | string;
  expiresAt: null | number;
}

const EMPTY_CONTEXT: SecurityContext = {
  token: null,
  expiresAt: null
} as const;

let securityContext = EMPTY_CONTEXT;

function checkIfTokenIsValid(context: SecurityContext) {
  const { expiresAt, token } = context;
  if (!expiresAt || !token) {
    return false;
  }
  if (isEpochExpired(expiresAt)) {
    log.debug('Auth token is expired');
    return false;
  }
  return true;
}

async function authAndGetContext(): Promise<SecurityContext> {
  const username = env.easyMsLogin;
  const password = env.easyMsPw;
  const baseURL = env.easyMsBaseUrl;
  try {
    const { data: { access_token: jwt } } = await fetch('integration/auth', {
      baseURL,
      data: { username, password }
    });
    if (typeof jwt !== 'string') {
      log.error('Token is not a string', jwt);
      return EMPTY_CONTEXT;
    }
    const [, payloadInBase64] = jwt.split('.');
    const decodedPayload = decodeBase64String(payloadInBase64);
    const payload = JSON.parse(decodedPayload);
    return {
      token: jwt,
      expiresAt: payload.exp
    };
  } catch (e: unknown) {
    log.error('Error while trying to auth', e);
    return EMPTY_CONTEXT;
  }
}

async function authenticateAndFillContext(): Promise<void> {
  securityContext = await authAndGetContext();
}

/**
 * If token the token is invalid, authenticates and returns it,
 * otherwise, returns the cached token
 * @return string jwt
 */
async function authenticateAndGetToken(): Promise<string> {
  const tokenIsValid = checkIfTokenIsValid(securityContext);
  if (!tokenIsValid) {
    await authenticateAndFillContext();
  }
  return securityContext.token;
}

export { authenticateAndGetToken, authenticateAndFillContext };
