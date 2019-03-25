module.exports = {
  preset: 'react-native',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.(spec|test).(ts|tsx|js|jsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['./testSetup.ts'],
  transform: {
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
    '.*.tsx?$': 'ts-jest',
  },
  timers: 'fake',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
}
