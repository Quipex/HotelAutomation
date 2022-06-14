import { JSONFile, Low } from 'lowdb';
import { log } from './logger';

type LocalDbData = {
  lastNotificationId: number;
};

// Use JSON file for storage
const adapter = new JSONFile<LocalDbData>('data/app.db.json');
const localDb = new Low(adapter);

localDb.read()
  .then(() => {
    log.info('✅  Read the contents of local db');
  })
  .catch((e) => {
    log.error('☠  Failed to read the contents of local db', e);
    process.exit(1);
  });

export default localDb;
