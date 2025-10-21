import type { Ref } from '@vue/reactivity'
import type { ComponentInternalInstance } from './component'
import type { RawSlots } from './componentSlots'
import type { RendererNode } from './renderer'
import { isRef } from '@vue/reactivity'
import { isArray, isFunction, isString, ShapeFlags } from '@vue/shared'
import { currentRenderingInstance, currentScopeId } from './componentRenderContext'

export const Fragment = Symbol.for('v-fgt') as any as {
  __isFragment: true
  new (): {
    $props: VNodeProps
  }
}
export const Text: unique symbol = Symbol.for('v-txt')
export const Comment: unique symbol = Symbol.for('v-cmt')

export type VNodeTypes
  = | string
    | VNode
    | typeof Fragment
    | typeof Text
    | typeof Comment

export type VNodeRef
  = | string
    | Ref
    | ((
      ref: Element | null,
      refs: Record<string, any>,
    ) => void)

export interface VNodeNormalizedRefAtom {
  i: ComponentInternalInstance
  r: VNodeRef
  k?: string
  f?: boolean
}

export interface VNodeProps {
  key?: PropertyKey
  ref?: VNodeRef
  ref_for?: boolean
  ref_key?: string
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

export type VNodeChild = VNodeChildAtom | VNodeArrayChildren

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

  key: PropertyKey | null
  type: VNodeTypes
  props: (VNodeProps & ExtraProps) | null
  children: VNodeNormalizedChildren

  // DOM
  el: HostNode | null
  placeholder: HostNode | null
  anchor: HostNode | null

  // optimization only
  shapeFlag: number
  patchFlag: number
  dynamicChildren: (VNode[] & { hasOnce?: boolean }) | null
}

export function isVNode(value: any): value is VNode {
  return value ? value.__v_isVNode === true : false
}

export function isSameVNodeType(n1: VNode, n2: VNode): boolean {
  return n1.type === n2.type && n1.key === n2.key
}

const normalizeKey = ({ key }: VNodeProps): VNode['key'] =>
  key != null ? key : null

const normalizeRef = ({
  ref,
  ref_key,
  ref_for,
}: VNodeProps): VNodeNormalizedRefAtom | null => {
  if (typeof ref === 'number') {
    ref = `${ref}`
  }
  return (
    ref != null
      ? isString(ref) || isRef(ref) || isFunction(ref)
        ? { i: currentRenderingInstance, r: ref, k: ref_key, f: !!ref_for }
        : ref
      : null
  ) as any
}

export const createVNode = _createVNode as typeof _createVNode

function _createVNode(
  type: VNodeTypes,
  props: VNodeProps | null = null,
  children: unknown = null,
  patchFlag: number = 0,
  dynamicProps: string[] | null = null,
) {
  if (!type) {
    type = Comment
  }

  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : 0

  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    true,
  )
}

export function normalizeVNode(child: VNodeChild): VNode {
  if (child === null || typeof child === 'boolean') {
    return createVNode(Comment)
  }
  else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      child.slice(),
    )
  }
  else if (isVNode(child)) {
    // TODO clone
    return child
  }
  else {
    return createVNode(Text, null, String(child))
  }
}

function normalizeChildren(vnode: VNode, children: unknown) {
  let type = 0

  if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  }
  else {
    children = String(children)
    type = ShapeFlags.TEXT_CHILDREN
  }

  vnode.children = children as VNodeNormalizedChildren
  vnode.shapeFlag |= type
}

export function createTextVNode(text: string = ' ', flag: number = 0): VNode {
  return createVNode(Text, null, text, flag)
}

function createBaseVNode(
  type: VNodeTypes,
  props: VNodeProps | null = null,
  children: unknown = null,
  patchFlag = 0,
  dynamicProps: string[] | null = null,
  shapeFlag: number = ShapeFlags.ELEMENT,
  needFullChildrenNormalization = false,
) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    placeholder: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance,
  } as VNode

  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children)
  }
  else if (children) {
    vnode.shapeFlag |= isString(children)
      ? ShapeFlags.TEXT_CHILDREN
      : ShapeFlags.ARRAY_CHILDREN
  }

  return vnode
}
