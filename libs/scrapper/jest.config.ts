/* eslint-disable */
export default {
  displayName: 'scrapper',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageDirectory: '../../coverage/apps/scrapper',
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
