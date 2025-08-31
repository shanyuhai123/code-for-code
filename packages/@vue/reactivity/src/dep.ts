import type { TrackOpTypes, TriggerOpTypes } from './constants'
import type { ReactiveEffect } from './effect'
import { activeEffect, shouldTrack } from './effect'

export const ITERATE_KEY: unique symbol = Symbol(__DEV__ ? 'Object iterate' : '')

export class Dep {
  version = 0

  map?: KeyToDepMap = undefined
  key?: unknown = undefined
  effect = new Set<ReactiveEffect>()

  constructor() {

  }

  track() {
    if (!shouldTrack || !activeEffect) {
      return
    }

    this.effect.add(activeEffect)
    activeEffect.deps.push(this)
  }

  trigger() {
    const effectToRun = new Set(this.effect)
    effectToRun.forEach((e) => {
      if (e !== activeEffect) {
        e.run()
      }
    })
  }
}

type KeyToDepMap = Map<any, Dep>
export const targetMap: WeakMap<object, KeyToDepMap> = new WeakMap()

export function track(target: object, type: TrackOpTypes, key: unknown): void {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, dep = new Dep())
      dep.map = depsMap
      dep.key = key
    }

    dep.track()
  }
}

export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
): void {
  const depsMap = targetMap.get(target)
  if (!depsMap)
    return

  const dep = depsMap.get(key)
  if (!dep)
    return

  dep.trigger()
}
