module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  reporters: ['default', 'jest-junit'],
  coverageThreshold: {
    global: {
      branches: 3,
      functions: 7,
      lines: 10,
      statements: 10
    }
  },
  setupTestFrameworkScriptFile: '<rootDir>/src/Tests/Enzyme/enzyme-setup.ts',
  coverageReporters: ['text', 'cobertura']
};
