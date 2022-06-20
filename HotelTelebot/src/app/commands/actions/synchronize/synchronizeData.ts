// noinspection ES6PreferShortImport
import { synchronizeDataGenerator } from './synchronizeDataGenerator';

const synchronizeData = async () => {
  const syncIterator = synchronizeDataGenerator();
  let nextVal = syncIterator.next();
  while (!nextVal.done) {
    nextVal = syncIterator.next();
  }
};

export { synchronizeData };
