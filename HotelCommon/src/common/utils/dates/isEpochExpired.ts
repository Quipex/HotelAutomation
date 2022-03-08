import { dateToUnixSeconds } from './dateToUnixSeconds';

const isEpochExpired = (unixSeconds: number) => {
  const currentTimeInUnixSeconds = dateToUnixSeconds(new Date());
  const diffFromNow = currentTimeInUnixSeconds - unixSeconds;
  return diffFromNow >= 0;
};

export { isEpochExpired };
