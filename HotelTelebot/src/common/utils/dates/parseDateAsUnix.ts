function parseDateAsUnix(dateText: string): number | null {
  const parsedDate = parseDate(dateText);
  if (!parsedDate) {
    return null;
  }
  return toUnixDate(parsedDate);
}

export { parseDateAsUnix };
