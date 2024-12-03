export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const moduleDirectories = ['node_modules', 'src'];
export const testMatch = ['**/__tests__/**/*.test.ts'];

export const collectCoverage = true;
export const coverageDirectory = 'coverage';
export const coverageReporters = [
  'text',
  'lcov',
  'html',
];
