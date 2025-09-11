import type { RawSlots } from './componentSlots'
import type { RendererNode } from './renderer'

export type VNodeTypes
  = | string
    | VNode

export interface VNodeProps {
  key?: PropertyKey
}

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
    | RawSlots
    | null
export interface VNode<
  HostNode = RendererNode,
  ExtraProps = { [key: string]: any },
> {
  type: VNodeTypes
  props?: (VNodeProps & ExtraProps) | null
  children?: VNodeNormalizedChildren

  // DOM
  el?: HostNode | null
}
