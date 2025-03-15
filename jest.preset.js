const nxPreset = require('@nx/jest/preset').default;

/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/../../jest.setup.ts'],
  ...nxPreset,
};
