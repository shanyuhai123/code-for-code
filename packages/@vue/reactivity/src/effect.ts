import { extend, isArray, isIntegerKey } from '@vue/shared'
import { createDep, Dep } from './dep'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { Target } from './reactive'

type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()

export type EffectScheduler = (...args: any[]) => any

export interface ReactiveEffectOptions {
  lazy?: boolean
}

export type DebuggerEventExtraInfo = {
  target: object
  type: TrackOpTypes | TriggerOpTypes
  key: any
  newValue?: any
  oldValue?: any
  oldTarget?: Map<any, any> | Set<any>
}

export type DebuggerEvent = {
  effect: ReactiveEffect
} & DebuggerEventExtraInfo

let shouldTrack = true
const trackStack: boolean[] = []

export function pauseTracking () {
  trackStack.push(shouldTrack)
  shouldTrack = false
}

export function enableTracking () {
  trackStack.push(shouldTrack)
  shouldTrack = true
}

export function resetTracking () {
  const last = trackStack.pop()
  shouldTrack = last === undefined ? true : last
}

export const ITERATE_KEY = Symbol(__DEV__ ? 'iterate' : '')

const effectStack: ReactiveEffect[] = []
let activeEffect: ReactiveEffect | undefined

export function isTracking () {
  return shouldTrack && activeEffect !== undefined
}

export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []

  computed?: boolean
  allowRecurse?: boolean
  onStop?: () => void
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void

  constructor (
    public fn: () => T,
    public scheduler: EffectScheduler | null = null
  ) {}

  run () {
    if (!this.active) {
      return this.fn()
    }

    if (!effectStack.includes(this)) {
      try {
        effectStack.push((activeEffect = this))
        enableTracking()

        return this.fn()
      } finally {
        resetTracking()
        effectStack.pop()
        const n = effectStack.length
        activeEffect = n > 0 ? effectStack[n - 1] : undefined
      }
    }
  }

  stop () {
    if (this.active) {
      if (this.onStop) {
        this.onStop()
      }

      this.active = false
    }
  }
}

function createReactiveEffect<T = any> (
  fn: () => T,
  options?: ReactiveEffectOptions
) {
  const _effect = new ReactiveEffect(fn)

  return _effect
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

export function effect<T = any> (
  fn: () => T,
  options?: ReactiveEffectOptions
) {
  const _effect = createReactiveEffect(fn, options)

  if (options) {
    extend(_effect, options)
  }

  if (!options || !options.lazy) {
    _effect.run()
  }

  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}

export function track (target: Target, type: TrackOpTypes, key: unknown) {
  if (!isTracking()) {
    return
  }

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }

  trackEffects(dep)
}

export function trackEffects (dep: Dep) {
  let shouldTrack = false
  shouldTrack = !dep.has(activeEffect!)

  if (shouldTrack) {
    dep.add(activeEffect!)
    activeEffect!.deps.push(dep)
    if (__DEV__ && activeEffect!.onTrack) {
      activeEffect!.onTrack(
        Object.assign(
          {
            effect: activeEffect!
          }
        )
      )
    }
  }
}

export function trigger (target: Target, type: TriggerOpTypes, key: unknown, newValue?: unknown, oldValue?: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  let deps: (Dep | undefined)[] = []
  if (type === TriggerOpTypes.CLEAR) {
    deps = [...depsMap.values()]
  } else if (key === 'length' && isArray(target)) {
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= (newValue as number)) {
        deps.push(dep)
      }
    })
  } else {
    // eslint-disable-next-line no-void
    if (key !== void 0) {
      deps.push(depsMap.get(key))
    }

    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get('length'))
        }
        break
    }
  }

  if (deps.length === 1) {
    if (deps[0]) {
      triggerEffects(deps[0])
    }
  } else {
    const effects: ReactiveEffect[] = []
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep)
      }
    }

    triggerEffects(createDep(effects))
  }
}

export function triggerEffects (dep: Dep | ReactiveEffect[]) {
  for (const effect of isArray(dep) ? dep : [...dep]) {
    if (effect !== activeEffect || effect.allowRecurse) {
      if (__DEV__ && effect.onTrigger) {
        effect.onTrigger(extend({ effect }))
      }
      if (effect.scheduler) {
        effect.scheduler()
      } else {
        effect.run()
      }
    }
  }
}
