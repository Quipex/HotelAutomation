import bunyan from 'bunyan';

const migrationLog = bunyan.createLogger({
  name: 'Orm_Migrations',
  streams: [
    {
      level: 'info',
      path: 'logs/db/migrations.log',
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

export { migrationLog };
