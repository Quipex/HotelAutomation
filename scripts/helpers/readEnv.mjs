import { EOL_REGEX } from "../constants/textFileRegex.mjs";

/**
 * @param {string} pathToRead
 * @return {Array}
 */
const readEnv = pathToRead => {
  if (!fs.pathExistsSync(pathToRead)) {
    console.warn(`⚠ '${pathToRead}' does not exist`)
    return [];
  }
  const stats = fs.lstatSync(pathToRead);
  if (stats.isDirectory()) {
    return fs.readdirSync(pathToRead, { withFileTypes: true })
      .filter(item => !item.isDirectory())
      .map(item => path.resolve(pathToRead, item.name))
      .flatMap(itemPath => readEnv(itemPath));
  }
  if (!stats.isFile()) {
    console.warn(`⚠ '${pathToRead}' is not a file, nor a directory`);
    return [];
  }
  return [readEnvFile(pathToRead)];
};

const envLineRegex = /^([^=]+)=([^=]*)$/;

const readEnvFile = pathToRead => {
  const fileBuf = fs.readFileSync(pathToRead);
  const envLines = fileBuf.toString()
    .split(EOL_REGEX)
    .filter(line => envLineRegex.test(line));

  const map = envLines.reduce((acc, currLine) => {
    const [, key, val] = envLineRegex[Symbol.match](currLine);
    acc[key] = val;
    return acc;
  }, {});
  return { path: pathToRead, map };
};

export default readEnv;
