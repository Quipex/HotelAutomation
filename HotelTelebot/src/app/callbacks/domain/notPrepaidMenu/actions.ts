const prefix = (text) => `npm${text}`;

const npmOverall = prefix('All');
const npmNotExpired = prefix('NE');
const npmExpired = prefix('E');
const npmNeedReminding = prefix('NR');

export { npmExpired, npmNotExpired, npmOverall, npmNeedReminding };
