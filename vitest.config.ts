import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    __DEV__: true,
    __TEST__: true,
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, 'examples/**/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['packages/**/src/**'],
      exclude: [],
    },
  },
})
