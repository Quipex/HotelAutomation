const SET_NOTE_REGEX = /([^\s\n]+\s([^\s\n]+)[\s\n]+)/;

const getCommandAndFirstArg = (text) => {
  const [, commandAndFirstArg, firstArg] = SET_NOTE_REGEX.exec(text);
  return { commandAndFirstArg, firstArg };
};

export { getCommandAndFirstArg };
