import { createLogger } from './createLogger';
import { getLogLevel } from './getLogLevel';

jest.mock('./getLogLevel');

describe('createLogger', () => {
  const getLogLevelMock = getLogLevel as jest.Mock;
  afterEach(() => getLogLevelMock.mockReset());
  it('should not throw error logging', () => {
    getLogLevelMock.mockReturnValueOnce('warn');
    const logger = createLogger('test-logger');
    expect(() => logger.info('test')).not.toThrow();
    expect(logger.level()).toEqual(40);
  });
});
