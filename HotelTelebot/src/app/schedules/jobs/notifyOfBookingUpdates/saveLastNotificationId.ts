import localDb from '~/config/localDb';

const saveLastNotificationId = async (id: number) => {
  localDb.data.lastNotificationId = id;
  await localDb.write();
};

export { saveLastNotificationId };
