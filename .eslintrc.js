const tsRules = {
  'no-use-before-define': 'off',
  '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false }],
  'no-redeclare': 'off',
  '@typescript-eslint/no-redeclare': ['error']
}

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  globals: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
    __GLOBAL__: true,
    __ESM_BUNDLER__: true,
    __ESM_BROWSER__: true,
    __NODE_JS__: true,
    __COMMIT__: true,
    __VERSION__: true,
    __COMPAT__: true
  },
  extends: [
    'standard'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'no-unused-vars': [
      'error',
      // we are only using this rule to check for unused arguments since TS
      // catches unused variables but not args.
      { varsIgnorePattern: '.*', args: 'none' }
    ],
    'no-control-regex': 'off',
    ...tsRules
  }
}
