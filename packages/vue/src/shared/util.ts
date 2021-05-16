const _toString = Object.prototype.toString

export const emptyObject = Object.freeze({})

export const isObject = (obj: any): boolean => obj !== null && typeof obj === 'object'
export const isPlainObject = (obj: any): boolean => _toString.call(obj) === '[object Object]'

export const noop = (a?: any, b?: any, c?: any): void => {}

export const no = (a?: any, b?: any, c?: any) => false

export const toArray = <T>(list: ArrayLike<T>, start: number = 0): Array<T> => {
  let i = list.length - start

  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }

  return ret
}

export const makeMap = (str: string, expectsLowerCase: boolean = false): (str: string) => boolean => {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')

  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }

  return expectsLowerCase
    ? (val: string) => map[val.toLowerCase()]
    : (val: string) => map[val]
}

export const isBuiltInTag: (str: string) => boolean = makeMap('slot,component', true)

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
