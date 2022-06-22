const resolveBooleanFromString = (text?: string): boolean | null | undefined => {
  if (text === null || text === undefined) {
    return text as undefined;
  }
  const lowercase = text.toLowerCase();
  if (lowercase === 'true') {
    return true;
  }
  if (lowercase === 'false') {
    return false;
  }
  throw new Error(`Unrecognized boolean value: '${text}'`);
};

export { resolveBooleanFromString };
