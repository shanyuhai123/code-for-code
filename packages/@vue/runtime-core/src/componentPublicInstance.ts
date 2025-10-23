import type { ComponentInternalInstance } from './component'

export interface ComponentCustomProperties {}

export interface ComponentPublicInstance {
  $: ComponentInternalInstance

  $root: ComponentPublicInstance | null
  $parent: ComponentPublicInstance | null
  $host: Element | null
}

export const PublicInstanceProxyHandlers: ProxyHandler<any> = {

}
