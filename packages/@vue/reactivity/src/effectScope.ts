import type { ReactiveEffect } from './effect'

export let activeEffectScope: EffectScope | undefined

export class EffectScope {
  private _active = true

  effects: ReactiveEffect[] = []

  parent: EffectScope | undefined
  scopes: EffectScope[] | undefined
  private index: number | undefined

  constructor(public detached = false) {
    this.parent = activeEffectScope
    if (!detached && activeEffectScope) {
      this.index
        = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this,
        ) - 1
    }
  }

  get active() {
    return this._active
  }

  run() {

  }
}
