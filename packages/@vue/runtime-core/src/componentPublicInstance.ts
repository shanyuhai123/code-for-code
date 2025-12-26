import type { ComponentInternalInstance } from './component'

export interface ComponentCustomProperties {}

export interface ComponentPublicInstance {
  $: ComponentInternalInstance

  $root: ComponentPublicInstance | null
  $parent: ComponentPublicInstance | null
  $host: Element | null
}

export const PublicInstanceProxyHandlers: ProxyHandler<any> = {
  get({ _: instance }, key: string) {
    const { props, data, ctx } = instance

    // public $ property
    if (key === '$') {
      return instance
    }

    // props
    if (key in props) {
      return props[key]
    }

    // data
    if (key in data) {
      return data[key]
    }

    // ctx
    if (key in ctx) {
      return ctx[key]
    }
  },
}
