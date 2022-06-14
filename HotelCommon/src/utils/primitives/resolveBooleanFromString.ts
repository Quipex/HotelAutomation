const resolveBooleanFromString = (text: string) => {
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
