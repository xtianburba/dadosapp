const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  ...expoPreset,
  transform: {
    ...expoPreset.transform,
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^expo/src/winter$': '<rootDir>/src/__mocks__/expo-winter.ts',
  },
};
