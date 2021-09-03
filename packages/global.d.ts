// Global compile-time constants
declare let __DEV__: boolean
declare let __TEST__: boolean
declare let __BROWSER__: boolean
declare let __GLOBAL__: boolean
declare let __ESM_BUNDLER__: boolean
declare let __ESM_BROWSER__: boolean
declare let __NODE_JS__: boolean
declare let __COMMIT__: string
declare let __VERSION__: string
declare let __COMPAT__: boolean

declare namespace jest {
  interface Matchers<R, T> {
    toHaveBeenWarned(): R
    toHaveBeenWarnedLast(): R
    toHaveBeenWarnedTimes(n: number): R
  }
}
