import { defineConfig } from 'vite'

export default defineConfig({
  base: '/code-for-code/playground/',
  define: {
    __DEV__: process.env.NODE_ENV !== 'production',
  },
})
