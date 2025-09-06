import type { TrackOpTypes } from './constants'
import type { Subscriber } from './effect'
import { TriggerOpTypes } from './constants'
import { activeSub, EffectFlags, endBatch, shouldTrack, startBatch } from './effect'

export const ITERATE_KEY: unique symbol = Symbol(__DEV__ ? 'Object iterate' : '')

export let globalVersion = 0

export class Link {
  version: number

  /**
   * 双链表
   */
  nextDep?: Link
  prevDep?: Link
  nextSub?: Link
  prevSub?: Link
  prevActiveLink?: Link

  constructor(
    public sub: Subscriber,
    public dep: Dep,
  ) {
    this.version = dep.version

    this.nextDep
      = this.prevDep
      = this.nextSub
      = this.prevSub
      = this.prevActiveLink
        = undefined
  }
}

export class Dep {
  version = 0
  activeLink?: Link = undefined

  /**
   * tail
   */
  subs?: Link = undefined
  /**
   * head
   */
  subsHead?: Link = undefined

  map?: KeyToDepMap = undefined
  key?: unknown = undefined

  /**
   * 订阅数
   */
  sc: number = 0

  constructor() {

  }

  track() {
    if (!shouldTrack || !activeSub) {
      return
    }

    let link = this.activeLink
    if (link === undefined || link.sub !== activeSub) {
      link = this.activeLink = new Link(activeSub, this)

      if (!activeSub.deps) {
        activeSub.deps = activeSub.depsTail = link
      }
      else {
        link.prevDep = activeSub.depsTail
        activeSub.depsTail!.nextDep = link
        activeSub.depsTail = link
      }

      addSub(link)
    }

    return link
  }

  trigger() {
    this.version++
    globalVersion++
    this.notify()
  }

  notify() {
    startBatch()

    try {
      for (let link = this.subs; link; link = link.prevSub) {
        link.sub.notify()
      }
    }
    finally {
      endBatch()
    }
  }
}

function addSub(link: Link) {
  link.dep.sc++

  if (link.sub.flags & EffectFlags.TRACKING) {
    const currentTail = link.dep.subs
    if (currentTail !== link) {
      link.prevSub = currentTail
      if (currentTail)
        currentTail.nextSub = link
    }

    if (link.dep.subsHead === undefined) {
      link.dep.subsHead = link
    }
    link.dep.subs = link
  }
}

type KeyToDepMap = Map<any, Dep>
export const targetMap: WeakMap<object, KeyToDepMap> = new WeakMap()

export function track(target: object, type: TrackOpTypes, key: unknown): void {
  if (shouldTrack && activeSub) {
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

  const run = (dep: Dep) => {
    dep.trigger()
  }

  if (key !== void 0) {
    const dep = depsMap.get(key)

    if (dep)
      run(dep)
  }

  // key 的生成与 type 相关
  if (type === TriggerOpTypes.ADD) {
    const dep = depsMap.get(ITERATE_KEY)
    if (!dep)
      return

    run(dep)
  }
  else if (type === TriggerOpTypes.DELETE) {
    const dep = depsMap.get(ITERATE_KEY)
    if (!dep)
      return

    run(dep)
  }
  else {
    const dep = depsMap.get(key)
    if (!dep)
      return

    run(dep)
  }
}
