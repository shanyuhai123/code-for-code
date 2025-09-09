import type { RendererNode } from './renderer'

export type VNodeTypes
  = | string
    | VNode

type VNodeChildAtom
  = | VNode
    | string
    | number
    | boolean
    | null
    | undefined
    | void

export type VNodeArrayChildren = Array<VNodeArrayChildren | VNodeChildAtom>

export type VNodeNormalizedChildren
  = | string
    | VNodeArrayChildren
    | null

export interface VNode<
  HostNode = RendererNode,
> {
  type: VNodeTypes
  children: VNodeNormalizedChildren

  // DOM
  el: HostNode | null
}
