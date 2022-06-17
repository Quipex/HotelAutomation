// noinspection ES6PreferShortImport
import { dateToUnixMilliseconds } from './dateToUnixMilliseconds';

function dateToUnixSeconds(date: Date): number {
  return Math.floor(dateToUnixMilliseconds(date) / 1000);
}

export { dateToUnixSeconds };
