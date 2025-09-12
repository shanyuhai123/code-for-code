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
  __v_isVNode?: true

  key?: PropertyKey | null
  type: VNodeTypes
  props?: (VNodeProps & ExtraProps) | null
  children?: VNodeNormalizedChildren

  // DOM
  el?: HostNode | null
}

export function isVNode(value: any): value is VNode {
  return value ? value.__v_isVNode === true : false
}

export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  return n1.type === n2.type && n1.key === n2.key
}
