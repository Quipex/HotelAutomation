function dateToUnixDate(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export { dateToUnixDate };
