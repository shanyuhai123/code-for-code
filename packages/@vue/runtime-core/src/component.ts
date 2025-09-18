import type { VNode } from './vnode'

export type Data = Record<string, unknown>

export interface ComponentInternalInstance {
  uid: number

  vnode: VNode
}
