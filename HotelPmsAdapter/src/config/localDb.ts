import { JSONFile, Low } from 'lowdb';

type LocalDbData = {
  lastSynchronization: string;
};

const localDbPath = 'data/app.db.json';
const adapter = new JSONFile<LocalDbData>(localDbPath);
const localDb = new Low(adapter);

export { localDbPath };

export default localDb;
