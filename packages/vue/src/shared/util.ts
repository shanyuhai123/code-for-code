const _toString = Object.prototype.toString

export const emptyObject = Object.freeze({})

export const isObject = (obj: any): boolean => obj !== null && typeof obj === 'object'
export const isPlainObject = (obj: any): boolean => _toString.call(obj) === '[object Object]'

export const noop = (a?: any, b?: any, c?: any): void => {}

/**
 * Ensure a function is called only once.
 * @param fn Function
 * @returns Function
 */
export const once = (fn: Function): Function => {
  let called = false

  return function () {
    if (!called) {
      called = true
      fn.apply(null, arguments)
    }
  }
}
