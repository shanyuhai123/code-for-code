import type { ComponentInternalInstance, Data } from './component'
import type { VNode } from './vnode'
import { EMPTY_OBJ, isArray, ShapeFlags } from '@vue/shared'
import { Comment, isSameVNodeType, Text } from './vnode'
import { warn } from './warning'

export type ElementNamespace = 'svg' | 'mathml' | undefined

export interface Renderer<HostElement = RendererElement> {
  render: RootRenderFunction<HostElement>
}

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement,
> {
  patchProp: (
    el: HostElement,
    key: string,
    prevValue: any,
    nextValue: any,
    parentComponent?: ComponentInternalInstance | null,
  ) => void
  insert: (el: HostNode, parent: HostElement, anchor?: HostNode | null) => void
  remove: (el: HostNode) => void
  createComment: (text: string) => HostNode
  createText: (text: string) => HostNode
  createElement: (
    type: string,
    namespace?: ElementNamespace
  ) => HostElement
  setText: (node: HostNode, text: string) => void
  setElementText: (el: HostNode, text: string) => void
}

export interface RendererNode {
  [key: string | symbol]: any
}

export interface RendererElement extends RendererNode {}

export type RootRenderFunction<HostElement = RendererElement> = (
  vnode: VNode | null,
  container: HostElement,
) => void

type ProcessTextOrCommentFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
) => void

export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement,
>(options: RendererOptions<HostNode, HostElement>): Renderer<HostElement> {
  return baseCreateRenderer<HostNode, HostElement>(options)
}

function baseCreateRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement,
>(options: RendererOptions<HostNode, HostElement>): Renderer<HostElement>

// implementation
function baseCreateRenderer(options: RendererOptions) {
  const {
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    createComment: hostCreateComment,
    createText: hostCreateText,
    createElement: hostCreateElement,
    setText: hostSetText,
    setElementText: hostSetElementText,
  } = options

  const patch = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor = null,
    parentComponent = null,
  ) => {
    if (n1 === n2) {
      return
    }

    if (n1 && !isSameVNodeType(n1, n2)) {
      umount(n1)
      n1 = null
    }

    const { type, shapeFlag } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor)
        break
      case Comment:
        processCommentNode(n1, n2, container, anchor)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor, parentComponent)
        }
        else if (__DEV__) {
          warn('Invalid VNode type:', type, `(${typeof type})`)
        }
    }
  }

  const processText: ProcessTextOrCommentFn = (n1, n2, container, anchor) => {
    if (n1 === null) {
      hostInsert(
        n2.el = hostCreateText(n2.children as string),
        container,
        anchor,
      )
    }
    else {
      const el = (n2.el = n1.el!)
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children as string)
      }
    }
  }

  const processCommentNode: ProcessTextOrCommentFn = (
    n1,
    n2,
    container,
    anchor,
  ) => {
    if (n1 == null) {
      hostInsert(
        (n2.el = hostCreateComment((n2.children as string) || '')),
        container,
        anchor,
      )
    }
    else {
      n2.el = n1.el
    }
  }

  const processElement = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
  ) => {
    if (n1 === null) {
      mountElement(n2, container, anchor, parentComponent)
    }
    else {
      patchElement(n1, n2, parentComponent)
    }
  }

  const mountElement = (
    vnode: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
  ) => {
    const el = vnode.el = hostCreateElement(vnode.type as string)

    if (typeof vnode.children === 'string') {
      hostSetElementText(el, vnode.children)
    }
    else if (isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        patch(null, child as VNode, el)
      })
    }

    if (vnode.props) {
      for (const key in vnode.props) {
        hostPatchProp(el, key, null, vnode.props[key], parentComponent)
      }
    }

    hostInsert(el, container, anchor)
  }

  const patchElement = (
    n1: VNode,
    n2: VNode,
    parentComponent: ComponentInternalInstance | null,
  ) => {
    const el = (n2.el = n1.el!)

    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ

    patchProps(el, oldProps, newProps, parentComponent)
  }

  const patchProps = (
    el: RendererElement,
    oldProps: Data,
    newProps: Data,
    parentComponent: ComponentInternalInstance | null,
  ) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], parentComponent)
          }
        }
      }
    }
    for (const key in newProps) {
      const next = newProps[key]
      const prev = oldProps[key]
      if (next !== prev) {
        hostPatchProp(el, key, prev, next, parentComponent)
      }
    }
  }

  const umount = (vnode: VNode) => {
    if (vnode.el) {
      hostRemove(vnode.el)
    }
  }

  const render: RootRenderFunction = (vnode, container) => {
    if (vnode === null) {
      if (container._vnode) {
        umount(container._vnode)
      }
    }
    else {
      patch(
        container._vnode || null,
        vnode,
        container,
      )
    }

    container._vnode = vnode
  }

  return {
    render,
  }
}
