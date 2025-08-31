import type { ReactiveEffect } from './effect'

export let activeEffectScope: EffectScope | undefined

export class EffectScope {
  private _active = true

  effects: ReactiveEffect[] = []

  constructor() {

  }

  get active() {
    return this._active
  }

  run() {

  }
}
