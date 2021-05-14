import Vue from '..'
import { ComponentOptions } from '../types/options'

let uid = 0

export const _init = (vm: Vue, options: ComponentOptions): void => {
  vm._uid = uid++
  vm._isVue = true
}
