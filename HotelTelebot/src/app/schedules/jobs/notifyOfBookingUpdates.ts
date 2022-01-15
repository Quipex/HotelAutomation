import moment from 'moment';
import localDb from '../../db';
import { createSchedule } from '../schedule.helper';

createSchedule('0 */10 * * * *', updateReminder);

async function updateReminder() {
  await localDb.read();
  localDb.data!.lastUpdateNotification = moment().toISOString();
  await localDb.write();
}
