module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@vue/(.*?)$': '<rootDir>/packages/$1/src',
    'vue/(.*)$': '<rootDir>/packages/vue/src/$1'
  }
}
