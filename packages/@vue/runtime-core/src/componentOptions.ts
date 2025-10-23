import type { Component } from './component'

export interface ComponentOptionsBase {
  name?: string
  template?: string | object
  render?: Function
  components?: Record<string, Component>
}

export type ComponentOptions = ComponentOptionsBase
