import type { Dep } from './dep'
import { activeEffectScope } from './effectScope'

export let activeEffect: ReactiveEffect | undefined
export let shouldTrack = true

export class ReactiveEffect<T = any> {
  parent: ReactiveEffect | undefined = undefined

  deps: Dep[] = []

  constructor(public fn: () => T) {
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this)
    }
  }

  run() {
    const prevShouldTrack = shouldTrack
    shouldTrack = true

    try {
      this.parent = activeEffect
      cleanupEffects(this)
      activeEffect = this
      return this.fn()
    }
    finally {
      activeEffect = this.parent
      shouldTrack = prevShouldTrack
      this.parent = undefined
    }
  }

  stop() {
    //
  }
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

export function effect<T = any>(
  fn: () => T,
) {
  const e = new ReactiveEffect(fn)

  try {
    e.run()
  }
  catch (err) {
    e.stop()
    throw err
  }

  const runner = e.run.bind(e) as ReactiveEffectRunner
  runner.effect = e
  return runner
}

function cleanupEffects(e: ReactiveEffect) {
  const { deps } = e

  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].effect.delete(e)
    }

    deps.length = 0
  }
}
