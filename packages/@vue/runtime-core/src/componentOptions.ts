import type { ComputedGetter, WritableComputedOptions } from '@vue/reactivity'
import type { LooseRequired } from '@vue/shared'
import type { Component } from './component'
import type { ComponentPropsOptions } from './componentProps'
import type { VNodeChild } from './vnode'

export type RenderFunction = () => VNodeChild

export interface ComponentOptionsBase<Props, RawBindings> {
  setup?: (
    this: void,
    props: LooseRequired<Props>,
  ) => Promise<RawBindings> | RawBindings | RenderFunction | void
  name?: string
  template?: string | object
  render?: Function
  components?: Record<string, Component>
  props?: ComponentPropsOptions<Props>
}

export type ComponentOptions<
  Props = {},
  RawBindings = any,
> = ComponentOptionsBase<Props, RawBindings>

export type ComputedOptions = Record<
  string,
  ComputedGetter<any> | WritableComputedOptions<any>
>

export interface MethodOptions {
  [key: string]: Function
}
