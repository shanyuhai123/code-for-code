import type { Dep } from './dep'
import { extend } from '@vue/shared'
import { activeEffectScope } from './effectScope'

export type EffectScheduler = (...args: any[]) => any

export let activeEffect: ReactiveEffect | undefined
export let shouldTrack = true

export class ReactiveEffect<T = any> {
  parent: ReactiveEffect | undefined = undefined

  deps: Dep[] = []

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
  ) {
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

export interface ReactiveEffectOptions {
  scheduler?: EffectScheduler
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions,
) {
  const e = new ReactiveEffect(fn)

  if (options) {
    extend(e, options)
  }

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
