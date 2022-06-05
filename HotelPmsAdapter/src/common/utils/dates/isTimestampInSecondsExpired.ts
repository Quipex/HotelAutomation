const isTimestampInSecondsExpired = (timestampInSeconds: number): boolean => {
  return Math.floor(Date.now() / 1000.0) > timestampInSeconds;
};

export { isTimestampInSecondsExpired };
