export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}

export const EMPTY_ARR: readonly never[] = __DEV__
  ? Object.freeze([])
  : []

export const NOOP = (): void => {}

export const NO = () => false

export const extend: typeof Object.assign = Object.assign

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val: object, key: string | symbol): key is keyof typeof val => hasOwnProperty.call(val, key)
export const objectToString: typeof Object.prototype.toString
  = Object.prototype.toString
export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const isArray: typeof Array.isArray = Array.isArray
export const isMap = (val: unknown): val is Map<any, any> => toTypeString(val) === '[object Map]'
export const isSet = (val: unknown): val is Set<any> => toTypeString(val) === '[object Set]'
export const isDate = (val: unknown): val is Date => toTypeString(val) === '[object Date]'
export const isRegExp = (val: unknown): val is RegExp => toTypeString(val) === '[object RegExp]'
export const isFunction = (val: unknown): val is Function => typeof val === 'function'
export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<string, any> => val !== null && typeof val === 'object'
export const isPlainObject = (val: unknown): val is object => toTypeString(val) === '[object Object]'
