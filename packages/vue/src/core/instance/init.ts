import Vue from '..'
import { ComponentOptions } from '../types/options'
import { mergeOptions } from '../util'

let uid = 0

// simple
export const resolveConstructorOptions = (Ctor: typeof Vue): Object => {
  const options = Ctor.options

  return options
}

export const _init = (vm: Vue, options: ComponentOptions): void => {
  // uid
  vm._uid = uid++
  // a flag to avoid this being observed
  vm._isVue = true

  if (options && options._isComponent) {
    // nothing
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor as typeof Vue),
      options || {},
      vm
    )
  }
}
