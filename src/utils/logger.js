import bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'sn',
//   level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
  level: 'debug',
});

export default logger;
