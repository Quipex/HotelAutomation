import { ORGANIZATION_ID } from '~/common/constants/cloud_provider/easyms';

const GENERATED_NUMS = 8;
const GENERATED_CHARS = 2;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function getRandomInt(minInclusive, maxExclusive) {
  minInclusive = Math.ceil(minInclusive);
  maxExclusive = Math.floor(maxExclusive);
  return Math.floor(Math.random() * (maxExclusive - minInclusive) + minInclusive);
}

const getRandChar = () => {
  const charIndex = getRandomInt(0, ALPHABET.length);
  return ALPHABET.charAt(charIndex);
};

const generateStringChunk = (lengthOfGenerated, generationFn) => {
  let stringChunk = '';
  for (let i = 0; i < lengthOfGenerated; i += 1) {
    stringChunk = stringChunk.concat(generationFn());
  }
  return stringChunk;
};

const generateEasyMsId = () => {
  const suffix = generateStringChunk(GENERATED_CHARS, getRandChar);
  const prefix = generateStringChunk(GENERATED_NUMS, () => getRandomInt(0, 10));
  return suffix + ORGANIZATION_ID + prefix;
};

export { generateEasyMsId };
