import type { Ref } from './ref'
import { EMPTY_OBJ, NOOP } from '@vue/shared'
import { ReactiveEffect } from './effect'
import { isReactive } from './reactive'
import { isRef } from './ref'

export type WatchSource<T = any> = Ref<T, any>

export type WatchCallback<V = any, OV = any> = (
  value: V,
  oldValue: OV,
) => any

export interface WatchOptions {
  immediate?: boolean
}

export function watch(
  source: WatchSource | object,
  cb?: WatchCallback | null,
  options: WatchOptions = EMPTY_OBJ,
) {
  const { immediate } = options

  let effect: ReactiveEffect
  let getter: () => any

  if (isRef(source)) {
    getter = () => source.value
  }
  else if (isReactive(source)) {
    getter = () => source
  }
  else {
    getter = NOOP
  }

  let oldValue: any

  const job = () => {
    if (cb) {
      const newValue = effect.run()

      const prevValue = oldValue
      oldValue = newValue

      cb(newValue, prevValue)
    }
    else {
      effect.run()
    }
  }

  effect = new ReactiveEffect(getter, job)

  if (cb) {
    if (immediate) {
      job()
    }
    else {
      oldValue = effect.run()
    }
  }
  else {
    effect.run()
  }
}
