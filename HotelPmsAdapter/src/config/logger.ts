import bunyan from 'bunyan';

const log = bunyan.createLogger({
  name: 'main',
  src: true,
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'info',
      path: 'logs/app/full.log',
      type: 'rotating-file',
      period: '1d',
      count: 3
    },
    {
      level: 'error',
      path: 'logs/app/errors.log',
      type: 'rotating-file',
      period: '1d',
      count: 30
    }
  ]
});

const usersLog = bunyan.createLogger({
  name: 'Users activity',
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
});

export { log, usersLog };
