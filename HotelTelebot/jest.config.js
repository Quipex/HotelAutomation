const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['**/tests/testCases/**/*.test.ts'],
  setupFilesAfterEnv: ['./tests/jestSetup.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
};
