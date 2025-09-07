import { hasChanged, hasOwn, isArray, isObject } from '@vue/shared'
import { ReactiveFlags, TrackOpTypes, TriggerOpTypes } from './constants'
import { ITERATE_KEY, track, trigger } from './dep'
import { reactive, reactiveMap, readonlyMap, shallowReactiveMap, shallowReadonlyMap } from './reactive'
import { isRef } from './ref'
import { warn } from './warning'

class BaseReactiveHandler implements ProxyHandler<object> {
  constructor(
    public readonly _isReadonly: boolean,
    public readonly _isShallow: boolean,
  ) {}

  get(target: object, key: string | symbol, receiver: object): any {
    const isReadonly = this._isReadonly
    const isShallow = this._isShallow

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    else if (key === ReactiveFlags.IS_SHALLOW) {
      return isShallow
    }
    else if (key === ReactiveFlags.RAW) {
      if (
        receiver === (
          isReadonly
            ? isShallow
              ? shallowReadonlyMap
              : readonlyMap
            : isShallow
              ? shallowReactiveMap
              : reactiveMap
        ).get(target)
        || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)
      ) {
        return target
      }

      return
    }

    const res = Reflect.get(
      target,
      key,
      isRef(target) ? target : receiver,
    )

    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    if (isShallow) {
      return res
    }

    if (isObject(res)) {
      return reactive(res)
    }

    return res
  }
}

class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(
    isShallow = false,
  ) {
    super(false, isShallow)
  }

  set(
    target: Record<string | symbol, unknown>,
    key: string | symbol,
    value: unknown,
    receiver: object,
  ) {
    const oldVal = target[key]
    const hadKey = hasOwn(target, key)

    const res = Reflect.set(target, key, value, receiver)

    if (!hadKey) {
      trigger(target, TriggerOpTypes.ADD, key)
    }
    else if (hasChanged(value, oldVal)) {
      trigger(target, TriggerOpTypes.SET, key)
    }

    return res
  }

  has(
    target: object,
    key: string | symbol,
  ) {
    const res = Reflect.has(target, key)

    track(target, TrackOpTypes.HAS, key)

    return res
  }

  deleteProperty(
    target: object,
    key: string | symbol,
  ) {
    const res = Reflect.deleteProperty(target, key)

    if (res) {
      trigger(target, TriggerOpTypes.DELETE, key)
    }

    return res
  }

  ownKeys(
    target: object,
  ) {
    const res = Reflect.ownKeys(target)

    track(target, TrackOpTypes.ITERATE, ITERATE_KEY)

    return res
  }
}

class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow = false) {
    super(true, isShallow)
  }

  set(target: object, key: string | symbol) {
    if (__DEV__) {
      warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target,
      )
    }
    return true
  }

  deleteProperty(target: object, key: string | symbol) {
    if (__DEV__) {
      warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target,
      )
    }
    return true
  }
}

export const mutableHandlers: ProxyHandler<object> = new MutableReactiveHandler()

export const shallowReactiveHandlers = new MutableReactiveHandler(true)

export const readonlyHandlers = new ReadonlyReactiveHandler()
