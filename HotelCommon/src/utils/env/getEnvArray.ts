function getEnvArray(key: string, delimiter = ','): string[] {
  const envElement = process.env[key];
  return (envElement ?? '').split(delimiter);
}

export { getEnvArray };
