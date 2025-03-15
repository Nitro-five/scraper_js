/* eslint-disable */
export default {
  displayName: 'crawler',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageDirectory: '../../coverage/apps/crawler',
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
