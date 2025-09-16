/*
// type only
h('div')

// type + props
h('div', {})

// type + omit props + children
// Omit props does NOT support named slots
h('div', []) // array
h('div', 'foo') // text
h('div', h('br')) // vnode
h(Component, () => {}) // default slot

// type + props + children
h('div', {}, []) // array
h('div', {}, 'foo') // text
h('div', {}, h('br')) // vnode
h(Component, {}, () => {}) // default slot
h(Component, {}, {}) // named slots

// named slots without props requires explicit `null` to avoid ambiguity
h(Component, null, {})
**/

import type { RawSlots } from './componentSlots'
import type { VNode, VNodeArrayChildren, VNodeProps } from './vnode'
import { isArray, isObject } from '@vue/shared'
import { createVNode, isVNode } from './vnode'

type RawProps = VNodeProps & {
  // used to differ from a single VNode object as children
  __v_isVNode?: never
  // used to differ from Array children
  [Symbol.iterator]?: never
} & Record<string, any>

type RawChildren
  = | string
    | number
    | boolean
    | VNode
    | VNodeArrayChildren
    | (() => any)

type HTMLElementEventHandler = {
  [K in keyof HTMLElementEventMap as `on${Capitalize<K>}`]?: (
    ev: HTMLElementEventMap[K],
  ) => any
}

// The following is a series of overloads for providing props validation of
// manually written render functions.

// element
export function h<K extends keyof HTMLElementTagNameMap>(
  type: K,
  children?: RawChildren,
): VNode
export function h<K extends keyof HTMLElementTagNameMap>(
  type: K,
  props?: (RawProps & HTMLElementEventHandler) | null,
  children?: RawChildren | RawSlots,
): VNode

// custom element
export function h(type: string, children?: RawChildren): VNode
export function h(
  type: string,
  props?: RawProps | null,
  children?: RawChildren | RawSlots,
): VNode

// text/comment
export function h(
  type: typeof Text | typeof Comment,
  children?: string | number | boolean,
): VNode
export function h(
  type: typeof Text | typeof Comment,
  props?: null,
  children?: string | number | boolean,
): VNode

// Actual implementation
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const doCreateVNode = (type: any, props?: any, children?: any) => {
    try {
      return createVNode(type, props, children)
    }
    finally {
      // TODO
    }
  }

  const l = arguments.length
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // single vnode without props
      if (isVNode(propsOrChildren)) {
        return doCreateVNode(type, null, [propsOrChildren])
      }
      // props without children
      return doCreateVNode(type, propsOrChildren)
    }
    else {
      // omit props
      return doCreateVNode(type, null, propsOrChildren)
    }
  }
  else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    }
    else if (l === 3 && isVNode(children)) {
      children = [children]
    }
    return doCreateVNode(type, propsOrChildren, children)
  }
}
