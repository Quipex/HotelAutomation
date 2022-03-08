function unixDateToDate(unixDate: number): Date {
  return new Date(unixDate * 1000);
}

export { unixDateToDate };
