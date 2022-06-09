import bunyan from 'bunyan';

const log = bunyan.createLogger({
  name: 'General',
  src: true,
  streams: [
    {
      level: 'debug',
      path: 'logs/app/debug.log',
      period: '1d',
      type: 'rotating-file',
      count: 2
    },
    {
      level: (process.env.NODE_ENV === 'dev') ? 'debug' : 'info',
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
});

const testsLog = bunyan.createLogger({
  name: 'Tests',
  src: true,
  streams: [
    {
      level: 'debug',
      path: 'logs/app/tests.log',
      period: '1d',
      type: 'rotating-file',
      count: 2
    },
    {
      level: 'debug',
      stream: process.stdout
    }
  ]
});

export { log, usersLog, testsLog };
