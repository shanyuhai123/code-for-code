import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  rules: {
    'antfu/top-level-function': 'off',
    'ts/no-unsafe-function-type': 'off',
    'node/prefer-global/process': 'off',
    'import/no-mutable-exports': 'off',
    'ts/no-unnecessary-type-constraint': 'off',
    'ts/no-this-alias': 'off',
    'ts/no-empty-object-type': 'off',
    'ts/prefer-literal-enum-member': ['error', { allowBitwiseExpressions: true }],
  },
})
