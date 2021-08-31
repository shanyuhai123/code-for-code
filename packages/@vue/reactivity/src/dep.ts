let activeEffect: Function | null

export class Dep {
  #effects = new Set<Function>()

  depend () {
    if (activeEffect) {
      this.#effects.add(activeEffect)
    }
  }

  notify () {
    this.#effects.forEach(effect => effect())
  }
}

const targetMap = new WeakMap()

export function getDep (target, key): Dep {
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map())
  }
  const depMap = targetMap.get(target)
  if (!depMap.has(key)) {
    depMap.set(key, new Dep())
  }
  return depMap.get(key)
}

export function watchEffect (effect: Function) {
  activeEffect = effect
  effect()
  activeEffect = null
}
