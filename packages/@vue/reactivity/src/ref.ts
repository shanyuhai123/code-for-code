import { hasChanged, isArray, isObject } from '@vue/shared'
import { CollectionTypes } from './collectionHandlers'
import { track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { isProxy, reactive, Target, toRaw } from './reactive'

export declare const RefSymbol: unique symbol
type BaseTypes = string | number | boolean
export interface RefUnwrapBailTypes {}

export interface Ref<T = any> {
  value: T
  [RefSymbol]: true
  _shallow?: boolean
}

export type UnwrapRef<T> = T extends Ref<infer V>
  ? UnwrapRefSimple<V>
  : UnwrapRefSimple<T>

export type UnwrapRefSimple<T> = T extends Function | CollectionTypes | BaseTypes | Ref | RefUnwrapBailTypes
  ? T
  : T extends Array<any>
    ? { [K in keyof T]: UnwrapRefSimple<T[K]> }
    : T extends object
      ? {
        [P in keyof T]: P extends symbol ? T[P] : UnwrapRef<T[P]>
      }
      : T

const convert = <T extends unknown>(val: T): T =>
  isObject(val) ? reactive(val) : val

class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public readonly __v_isRef = true

  constructor (value: T, public readonly _shallow: boolean) {
    this._rawValue = _shallow ? value : toRaw(value)
    this._value = _shallow ? value : convert(value)
  }

  get value () {
    track(this as Target, TrackOpTypes.GET, 'value')
    return this._value
  }

  set value (newVal) {
    newVal = this._shallow ? newVal : toRaw(newVal)

    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = this._shallow ? newVal : convert(newVal)
      trigger(this as Target, TriggerOpTypes.SET, 'value', newVal)
    }
  }
}

export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
export function isRef (r: any): r is Ref {
  return Boolean(r && r.__v_isRef === true)
}

function createRef (rawValue: unknown, shallow: boolean = false) {
  if (isRef(rawValue)) {
    return rawValue
  }

  return new RefImpl(rawValue, shallow)
}

export function ref<T extends object>(value: T): ToRef<T>
export function ref<T>(value: T): Ref<UnwrapRef<T>>
export function ref<T = any>(): Ref<T | undefined>
export function ref (value?: unknown) {
  return createRef(value)
}

class ObjectRefImpl<T extends object, K extends keyof T> {
  public readonly __v_isRef = true

  constructor (private readonly _object: T, private readonly _key: K) {}

  get value () {
    return this._object[this._key]
  }

  set value (newValue) {
    this._object[this._key] = newValue
  }
}

export type ToRef<T> = [T] extends [Ref] ? T : Ref<UnwrapRef<T>>
export function toRef<T extends object, K extends keyof T> (
  object: T,
  key: K
): ToRef<T[K]> {
  const val = object[key]
  return isRef(val) ? val : new ObjectRefImpl(object, key) as any
}

export type ToRefs<T = any> = {
  [K in keyof T]: T[K] extends Ref ? T[K] : Ref<UnwrapRef<T[K]>>
}
export function toRefs<T extends object> (object: T): ToRefs<T> {
  if (__DEV__ && !isProxy(object)) {
    console.warn('toRefs() expects a reactive object but but received a plain one.')
  }

  const ret: any = isArray(object) ? new Array(object.length) : {}
  for (const key in object) {
    ret[key] = toRef(object, key)
  }

  return ret
}
