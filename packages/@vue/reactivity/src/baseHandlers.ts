import { extend, isObject } from '@vue/shared'
import { reactive, ReactiveFlags, reactiveMap, readonly, readonlyMap, shallowReactiveMap, shallowReadonlyMap, Target, toRaw } from './reactive'

function createGetter (isReadonly = false, shallow = false) {
  return function get (target: Target, key: string | symbol, receiver: object) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly // isReactive 总是会执行 isReadonly，所以此处总是 !false
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (
      key === ReactiveFlags.RAW &&
      receiver ===
        (isReadonly
          ? shallow
            ? shallowReadonlyMap
            : readonlyMap
          : shallow
            ? shallowReactiveMap
            : reactiveMap).get(target)
    ) {
      return target
    }

    const res = Reflect.get(target, key, receiver)

    if (shallow) {
      return res
    }

    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

const get = createGetter()
const shallowGet = createGetter(false, true)
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createSetter (shallow = false) {
  return function set (target: Target, key: string | symbol, value: unknown, receiver: object) {
    if (!shallow) {
      value = toRaw(value)
    }

    const result = Reflect.set(target, key, value, receiver)

    return result
  }
}

const set = createSetter()
const shallowSet = createSetter(true)

export const mutableHandlers: ProxyHandler<object> = {
  get,
  set
}

export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  set (target, key) {
    if (__DEV__) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly`,
        target
      )
    }
    return true
  },
  deleteProperty (target, key) {
    if (__DEV__) {
      console.warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  }
}

export const shallowReactiveHandlers = extend(
  {},
  mutableHandlers,
  {
    get: shallowGet,
    set: shallowSet
  }
)

export const shallowReadonlyHandlers = extend(
  {},
  readonlyHandlers,
  {
    get: shallowReadonlyGet
  }
)
