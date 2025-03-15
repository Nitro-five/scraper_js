import { LogLevel } from 'bunyan';

export const getLogLevel = (): LogLevel => {
  switch (process.env['NODE_ENV']) {
    case 'prod':
    case 'production':
      return 'warn';
    default:
      return 'debug';
  }
};
