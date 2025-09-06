import { isObject } from '@vue/shared'
import { ReactiveFlags, TrackOpTypes, TriggerOpTypes } from './constants'
import { track, trigger } from './dep'
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
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object,
  ) {
    const res = Reflect.set(target, key, value, receiver)

    trigger(target, TriggerOpTypes.SET, key)

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
}

export const mutableHandlers: ProxyHandler<object> = new MutableReactiveHandler()
