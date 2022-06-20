import localDb from '~/config/localDb';

const markLastSynchronizationTime = async () => {
  localDb.data.lastSynchronization = new Date().toISOString();
  await localDb.write();
};

export { markLastSynchronizationTime };
