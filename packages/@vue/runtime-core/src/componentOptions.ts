import type { Component } from './component'
import type { ComponentPropsOptions } from './componentProps'

export interface ComponentOptionsBase<Props = {}> {
  name?: string
  template?: string | object
  render?: Function
  components?: Record<string, Component>
  props?: ComponentPropsOptions<Props>
}

export type ComponentOptions<Props = {}> = ComponentOptionsBase<Props>
