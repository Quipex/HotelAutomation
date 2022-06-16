import bunyan from 'bunyan';

const wipLog = bunyan.createLogger({
  name: 'Needs_Attention',
  src: process.env.NODE_ENV !== 'prod',
  streams: [
    {
      level: 'info',
      path: 'logs/wip/needs_attention.log',
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

export { wipLog };
