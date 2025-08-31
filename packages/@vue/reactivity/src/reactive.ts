import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandlers'
import { warn } from './warning'

export function reactive<T extends object>(target: T): T
export function reactive(target: object) {
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
  )
}

function createReactiveObject(
  target: object,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
) {
  if (!isObject(target)) {
    if (__DEV__) {
      warn(
        `value cannot be made ${isReadonly ? 'readonly' : 'reactive'}: ${String(target)}`,
      )
    }
    return target
  }

  const proxy = new Proxy(target, baseHandlers)

  return proxy
}
