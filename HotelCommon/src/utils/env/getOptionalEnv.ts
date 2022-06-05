const getOptionalEnv = (key: string): string | undefined => {
  return process.env[key];
};

export { getOptionalEnv };
