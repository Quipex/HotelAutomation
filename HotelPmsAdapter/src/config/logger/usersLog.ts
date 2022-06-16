import bunyan from 'bunyan';
import { enhanceLoggerWithRequestId } from '~/common/utils/logging';

const usersLog = enhanceLoggerWithRequestId(bunyan.createLogger({
  name: 'Users_Activity',
  streams: [
    {
      level: 'info',
      path: 'logs/users/activity.log',
      type: 'rotating-file',
      period: '1d',
      count: 30
    },
    {
      level: 'info',
      stream: process.stdout
    }
  ]
}));

export { usersLog };
