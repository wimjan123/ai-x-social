/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/models/(.*)$': '<rootDir>/src/models/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/api/(.*)$': '<rootDir>/src/api/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types$': '<rootDir>/src/lib/types',
    '^@/config$': '<rootDir>/src/lib/config',
    '^@/utils/(.*)$': '<rootDir>/src/lib/utils/$1'
  },
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: {
        verbatimModuleSyntax: false
      }
    }
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testMatch: [
    '<rootDir>/tests/**/*.test.ts',
    '<rootDir>/tests/**/*.spec.ts'
  ],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  testTimeout: 10000
};