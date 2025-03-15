/* eslint-disable */
export default {
  displayName: 'infrastructure',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  coverageDirectory: '../../coverage/apps/infrastructure',
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
