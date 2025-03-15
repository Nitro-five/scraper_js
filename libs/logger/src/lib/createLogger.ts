import { createLogger as createBunyanLogger } from 'bunyan';
import { getLogLevel } from './getLogLevel';

export const createLogger = (name: string) => createBunyanLogger({ name, level: getLogLevel() });
