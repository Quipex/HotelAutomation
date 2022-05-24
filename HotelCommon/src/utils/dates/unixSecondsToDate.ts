// noinspection ES6PreferShortImport
import { unixMillisecondsToDate } from './unixMillisecondsToDate';

function unixSecondsToDate(unixSeconds: number): Date {
  return unixMillisecondsToDate(unixSeconds * 1000);
}

export { unixSecondsToDate };
