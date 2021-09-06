import { isFunction, NOOP } from '@vue/shared'
import { ReactiveEffect, track, trigger } from './effect'
import { TrackOpTypes, TriggerOpTypes } from './operations'
import { ReactiveFlags, Target, toRaw } from './reactive'

// declare const ComoutedRefSymbol: unique symbol

class ComputedRefImpl {
  private _value
  private _dirty = true
  public readonly effect: ReactiveEffect

  public readonly __v_isRef = true
  public readonly [ReactiveFlags.IS_READONLY]: boolean

  constructor (getter, private readonly _setter, isReadonly: boolean) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        trigger(this as Target, TriggerOpTypes.SET, 'value')
      }
    })
    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value () {
    const self = toRaw(this)
    track(self as Target, TrackOpTypes.GET, 'value')
    if (self._dirty) {
      self._dirty = false
      self._value = self.effect.run()
    }
    return self._value
  }

  set value (newValue) {
    this._setter(newValue)
  }
}

export function computed (getterOrOptions) {
  let getter
  let setter

  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter, isFunction(getterOrOptions) || !getterOrOptions.set)
}
