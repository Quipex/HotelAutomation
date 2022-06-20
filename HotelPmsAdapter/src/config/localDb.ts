import { JSONFile, Low } from 'lowdb';
import { log } from './logger';

type LocalDbData = {
  lastSynchronization: string;
};

const dbPath = 'data/app.db.json';
const adapter = new JSONFile<LocalDbData>(dbPath);
const localDb = new Low(adapter);

localDb.read()
  .then(() => {
    log.info(`✅  Read the contents of local db '${dbPath}'`);
  })
  .catch((e) => {
    log.error(`☠  Failed to read the contents of local db '${dbPath}'`, e);
    process.exit(1);
  });

export default localDb;
