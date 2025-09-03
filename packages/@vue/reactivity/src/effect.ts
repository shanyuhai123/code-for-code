import type { Link } from './dep'
import { extend } from '@vue/shared'
import { activeEffectScope } from './effectScope'

export type EffectScheduler = (...args: any[]) => any

export let activeSub: Subscriber | undefined
export let shouldTrack = true

export enum EffectFlags {
  ACTIVE = 1 << 0,
  RUNNING = 1 << 1,
  TRACKING = 1 << 2,
  NOTIFIED = 1 << 3,
  DIRTY = 1 << 4,
  ALLOW_RECURSE = 1 << 5,
  PAUSED = 1 << 6,
  EVALUATED = 1 << 7,
}

export interface Subscriber {
  /**
   * head
   */
  deps?: Link
  /**
   * tail
   */
  depsTail?: Link
  /**
   * 状态
   */
  flags: EffectFlags
  /**
   * next
   */
  next?: Subscriber
  notify: () => true | void
}

export class ReactiveEffect<T = any> implements Subscriber {
  deps?: Link = undefined
  depsTail?: Link = undefined
  flags: EffectFlags = EffectFlags.ACTIVE | EffectFlags.TRACKING
  next?: Subscriber = undefined

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
  ) {
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this)
    }
  }

  notify(): void {
    batch(this)
  }

  run() {
    if (!(this.flags & EffectFlags.ACTIVE)) {
      return
    }

    this.flags |= EffectFlags.RUNNING
    const prevEffect = activeSub
    const prevShouldTrack = shouldTrack
    activeSub = this
    shouldTrack = true

    try {
      return this.fn()
    }
    finally {
      activeSub = prevEffect
      shouldTrack = prevShouldTrack
      this.flags &= ~EffectFlags.RUNNING
    }
  }

  stop() {
    //
  }

  trigger() {
    if (this.scheduler) {
      this.scheduler()
    }
    else {
      this.runIfDirty()
    }
  }

  runIfDirty() {
    if (isDirty(this)) {
      this.run()
    }
  }
}

let batchDepth = 0
let batchedSub: Subscriber | undefined

export function batch(sub: Subscriber) {
  sub.flags |= EffectFlags.NOTIFIED

  sub.next = batchedSub
  batchedSub = sub
}

export function startBatch() {
  batchDepth++
}

export function endBatch() {
  if (--batchDepth > 0) {
    return
  }

  let error: unknown
  while (batchedSub) {
    let e: Subscriber | undefined = batchedSub
    batchedSub = undefined

    while (e) {
      const next: Subscriber | undefined = e.next
      e.next = undefined
      e.flags &= ~EffectFlags.NOTIFIED

      try {
        (e as ReactiveEffect).trigger()
      }
      catch (e) {
        if (!error)
          error = e
      }

      e = next
    }
  }

  if (error)
    throw error
}

function isDirty(sub: Subscriber): boolean {
  for (let link = sub.deps; link; link = link?.nextDep) {
    if (link.dep.version !== link.version) {
      return true
    }
  }

  return false
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
