import { makeMap } from './makeMap'

export const EMPTY_OBJ: { readonly [key: string]: any } = __DEV__
  ? Object.freeze({})
  : {}

export const EMPTY_ARR: readonly never[] = __DEV__
  ? Object.freeze([])
  : []

export const NOOP = (): void => {}

export const NO = () => false

export const isOn = (key: string): boolean =>
  key.charCodeAt(0) === 111 /* o */
  && key.charCodeAt(1) === 110 /* n */
  // uppercase letter
  && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97)

export const isModelListener = (key: string): key is `onUpdate:${string}` =>
  key.startsWith('onUpdate:')

export const extend: typeof Object.assign = Object.assign

export const remove = <T>(arr: T[], el: T): void => {
  const i = arr.indexOf(el)
  if (i > -1) {
    arr.splice(i, 1)
  }
}

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

export const isIntegerKey = (key: unknown): boolean =>
  isString(key)
  && key !== 'NaN'
  && key[0] !== '-'
  && `${Number.parseInt(key, 10)}` === key

export const isReservedProp: (key: string) => boolean = makeMap(
  ',key,ref,ref_for,ref_key,'
  + 'onVnodeBeforeMount,onVnodeMounted,'
  + 'onVnodeBeforeUpdate,onVnodeUpdated,'
  + 'onVnodeBeforeUnmount,onVnodeUnmounted',
)

export const isBuiltInDirective: (key: string) => boolean = makeMap(
  'bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo',
)

const cacheStringFunction = <T extends (str: string) => string>(fn: T): T => {
  const cache: Record<string, string> = Object.create(null)
  return ((str: string) => {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }) as T
}

const camelizeRE = /-\w/g
export const camelize: (str: string) => string = cacheStringFunction(
  (str: string): string => {
    return str.replace(camelizeRE, c => c.slice(1).toUpperCase())
  },
)

const hyphenateRE = /\B([A-Z])/g
export const hyphenate: (str: string) => string = cacheStringFunction(
  (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase(),
)

export const capitalize: <T extends string>(str: T) => Capitalize<T>
  = cacheStringFunction(<T extends string>(str: T) => {
    return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
  })

export const toHandlerKey: <T extends string>(
  str: T,
) => T extends '' ? '' : `on${Capitalize<T>}` = cacheStringFunction(
  <T extends string>(str: T) => {
    const s = str ? `on${capitalize(str)}` : ``
    return s as T extends '' ? '' : `on${Capitalize<T>}`
  },
)

export const hasChanged = (value: any, oldValue: any): boolean =>
  !Object.is(value, oldValue)

export const invokeArrayFns = (fns: Function[], ...arg: any[]): void => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg)
  }
}

export const def = (
  obj: object,
  key: string | symbol,
  value: any,
  writable = false,
): void => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value,
  })
}
