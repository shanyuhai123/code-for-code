import type { VNode } from './vnode'

export interface ComponentInternalInstance {
  uid: number

  vnode: VNode
}
