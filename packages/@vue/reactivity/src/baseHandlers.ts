import { hasChanged, hasOwn, isObject } from '@vue/shared'
import { ReactiveFlags, TrackOpTypes, TriggerOpTypes } from './constants'
import { ITERATE_KEY, track, trigger } from './dep'
import { reactive, reactiveMap } from './reactive'

class BaseReactiveHandler implements ProxyHandler<object> {
  constructor(
    public readonly _isReadonly: boolean,
    public readonly _isShallow: boolean,
  ) {}

  get(target: object, key: string | symbol, receiver: object): any {
    const isReadonly = this._isReadonly

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    }
    else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    else if (key === ReactiveFlags.RAW) {
      if (receiver === reactiveMap.get(target)) {
        return target
      }

      return
    }

    const res = Reflect.get(target, key, receiver)

    track(target, TrackOpTypes.GET, key)

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

export const mutableHandlers: ProxyHandler<object> = new MutableReactiveHandler()
