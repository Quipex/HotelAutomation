import { MESSAGE_PREFIX } from './prefixConstant';

const extractMessageId = (composedString: string) => {
  if (composedString.startsWith(MESSAGE_PREFIX)) {
    return +composedString.substring(MESSAGE_PREFIX.length);
  }
  return +composedString;
};

export { extractMessageId };
