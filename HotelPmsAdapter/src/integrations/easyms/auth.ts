import axios, { AxiosError } from 'axios';
import { isTimestampInSecondsExpired } from '~/common/utils/dates';
import { decodeBase64String } from '~/common/utils/encoding';
import { sanitizeAxiosError } from '~/common/utils/web';
import env from '~/config/env';
import { log } from '~/config/logger';

type SecurityContext = {
  token: null | string;
  expiresAt: null | number;
};

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
  if (isTimestampInSecondsExpired(expiresAt)) {
    log.debug('Auth token is expired');
    return false;
  }
  return true;
}

async function authAndGetContext(): Promise<SecurityContext> {
  const username = env.easyMsLogin;
  const password = env.easyMsPw;
  const grantType = 'password';
  const Authorization = 'Basic ZWFzeW1zOnNlY3JldA==';
  const Origin = 'https://my.easyms.co';
  const referer = 'https://my.easyms.co/login';
  const baseURL = env.easyMsBaseUrl;
  try {
    const { data: { access_token: jwt } } = await axios('oauth/token', {
      method: 'post',
      baseURL,
      data: {
        username,
        password,
        grant_type: grantType
      },
      headers: {
        Authorization,
        Origin,
        referer,
        'Content-Type': 'multipart/form-data'
      }
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
    log.error('Error while trying to auth:', (e as AxiosError).isAxiosError ? sanitizeAxiosError(e) : e);
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
async function authenticateAndGetToken(forceLogin: boolean): Promise<string> {
  const tokenIsValid = checkIfTokenIsValid(securityContext);
  if (!tokenIsValid || forceLogin) {
    await authenticateAndFillContext();
  }
  return securityContext.token;
}

export { authenticateAndGetToken };
