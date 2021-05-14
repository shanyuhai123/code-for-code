const _toString = Object.prototype.toString

export const emptyObject = Object.freeze({})

export const isObject = (obj: any): boolean => obj !== null && typeof obj === 'object'
export const isPlainObject = (obj: any): boolean => _toString.call(obj) === '[object Object]'

export const noop = (a?: any, b?: any, c?: any): void => {}

export const toArray = <T>(list: ArrayLike<T>, start: number = 0): Array<T> => {
  let i = list.length - start

  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }

  return ret
}

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
