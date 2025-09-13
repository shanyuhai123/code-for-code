import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  rules: {
    'style/jsx-one-expression-per-line': 'off',
  },
})
