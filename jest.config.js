module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  globals: {
    __DEV__: true,
    __TEST__: true,
    __VERSION__: require('./package.json').version,
    __BROWSER__: false,
    __GLOBAL__: false,
    __ESM_BUNDLER__: true,
    __ESM_BROWSER__: false,
    __NODE_JS__: true,
    __FEATURE_OPTIONS_API__: true,
    __FEATURE_SUSPENSE__: true,
    __FEATURE_PROD_DEVTOOLS__: false,
    __COMPAT__: true,
    'ts-jest': {
      tsconfig: {
        target: 'esnext',
        sourceMap: true
      }
    }
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'packages/@vue/*/src/**/*.ts'
  ],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    '^@vue/(.*?)$': '<rootDir>/packages/@vue/$1/src'
    // '^vue$': '<rootDir>/packages/vue/src'
  }
}
