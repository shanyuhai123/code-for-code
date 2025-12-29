import { ReactiveEffect } from './effect'

export type ComputedGetter<T> = (oldValue?: T) => T
export type ComputedSetter<T> = (newValue: T) => void

export interface WritableComputedOptions<T, S = T> {
  get: ComputedGetter<T>
  set: ComputedSetter<S>
}

class ComputedRefImpl<T = any> {
  private _value: any = undefined
  public readonly _effect: ReactiveEffect
  public _dirty = true

  constructor(
    public fn: ComputedGetter<T>,
  ) {
    this._effect = new ReactiveEffect(this.fn, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }

  get value() {
    if (this._dirty) {
      this._value = this._effect.run()
      this._dirty = false
    }

    return this._value
  }
}

export function computed<T>(
  getter: ComputedGetter<T>,
) {
  const cRef = new ComputedRefImpl(getter)

  return cRef
}
