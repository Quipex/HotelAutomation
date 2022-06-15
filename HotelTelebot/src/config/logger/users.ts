import { createLogger } from 'bunyan';

const usersLog = createLogger({
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
    },
    {
      level: 'warn',
      stream: process.stderr
    }
  ]
});

export { usersLog };
