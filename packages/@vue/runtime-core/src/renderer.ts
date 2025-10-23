import type { ComponentInternalInstance, Data } from './component'
import type { VNode, VNodeArrayChildren } from './vnode'
import { EMPTY_ARR, EMPTY_OBJ, ShapeFlags } from '@vue/shared'
import { createComponentInstance } from './component'
import { Comment, Fragment, isSameVNodeType, normalizeVNode, Text } from './vnode'
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
  createElement: (type: string) => HostElement
  createText: (text: string) => HostNode
  createComment: (text: string) => HostNode
  setElementText: (el: HostNode, text: string) => void
  setText: (node: HostNode, text: string) => void
}

export interface RendererNode {
  [key: string | symbol]: any
}

export interface RendererElement extends RendererNode {}

export type RootRenderFunction<HostElement = RendererElement> = (
  vnode: VNode | null,
  container: HostElement,
) => void

type PatchFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor?: RendererNode | null,
  parentComponent?: ComponentInternalInstance | null,
) => void

type MoveFn = (
  vnode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  type: MoveType,
) => void

export type MountComponentFn = (
  initialVNode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
) => void

type ProcessTextOrCommentFn = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
) => void

export enum MoveType {
  ENTER,
  LEAVE,
  REORDER,
}

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

  const patch: PatchFn = (
    n1,
    n2,
    container,
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
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, anchor, parentComponent)
        }
        else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(n1, n2, container, anchor, parentComponent)
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
    const { type, shapeFlag } = vnode
    const el = vnode.el = hostCreateElement(type as string)

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, vnode.children as string)
    }
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode.children as VNode[], el)
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

    patchChildren(n1, n2, el, parentComponent)
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

  const processFragment = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
  ) => {
    const fragmentStartAnchor = (n2.el = n1 ? n1.el : hostCreateText(''))!
    const fragmentEndAnchor = (n2.anchor = n1 ? n1.anchor : hostCreateText(''))!

    if (n1 === null) {
      hostInsert(fragmentStartAnchor, container, anchor)
      hostInsert(fragmentEndAnchor, container, anchor)
      mountChildren(
        (n2.children || []) as VNodeArrayChildren,
        container,
      )
    }
    else {
      patchChildren(n1, n2, container, parentComponent)
    }
  }

  const processComponent = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
  ) => {
    if (n1 == null) {
      mountComponent(n2, container, anchor, parentComponent)
    }
    else {
      updateComponent(n1, n2)
    }
  }

  const mountComponent: MountComponentFn = (
    initialVNode,
    container,
    anchor,
    parentComponent,
  ) => {
    const instance = (initialVNode.component = createComponentInstance(initialVNode, parentComponent))
  }

  const updateComponent = () => {
    //
  }

  const patchChildren = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    parentComponent: ComponentInternalInstance | null,
  ) => {
    const c1 = n1 && n1.children
    const prevShapeFlag = n1 ? n1.shapeFlag : 0
    const c2 = n2.children

    const { patchFlag, shapeFlag } = n2
    if (patchFlag > 0) {
      patchUnkeyedChildren(c1 as VNode[], c2 as VNodeArrayChildren, container)
    }

    // n2 children has 3 possibilities: text, array, or no children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // n1 children is array
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1 as VNode[])
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2 as string)
      }
    }
    else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // array and array
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          patchKeyedChildren(
            c1 as VNode[],
            c2 as VNodeArrayChildren,
            container,
            parentComponent,
          )
        }
        else {
          unmountChildren(c1 as VNode[])
        }
      }
      else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(container, '')
        }

        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2 as VNode[], container)
        }
      }
    }
  }

  const patchUnkeyedChildren = (
    c1: VNode[],
    c2: VNodeArrayChildren,
    container: RendererElement,
  ) => {
    c1 = c1 || EMPTY_ARR
    c2 = c2 || EMPTY_ARR

    const oldLength = c1.length
    const newLength = c2.length
    const commonLength = Math.min(oldLength, newLength)

    let i
    for (i = 0; i < commonLength; i++) {
      const nextChild = (c2[i] = normalizeVNode(c2[i]))
      patch(c1[i], nextChild, container)
    }

    if (oldLength > newLength) {
      unmountChildren(c1, commonLength)
    }
    else {
      mountChildren(c2, container, commonLength)
    }
  }

  const patchKeyedChildren = (
    c1: VNode[],
    c2: VNodeArrayChildren,
    container: RendererElement,
    parentComponent: ComponentInternalInstance | null,
  ) => {
    let i = 0
    const l2 = c2.length
    let e1 = c1.length - 1
    let e2 = l2 - 1

    // sync from start
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = (c2[i] = normalizeVNode(c2[i]))

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container)
      }
      else {
        break
      }

      i++
    }

    // sync from end
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = (c2[e2] = normalizeVNode(c2[e2]))

      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container)
      }
      else {
        break
      }

      e1--
      e2--
    }

    // common sequence + mount
    if (i > e1) {
      if (i <= e2) {
        while (i <= e2) {
          patch(null, c2[i] = normalizeVNode(c2[i]), container)
          i++
        }
      }
    }
    // common sequence + unmount
    else if (i > e2) {
      while (i <= e1) {
        umount(c1[i])
        i++
      }
    }
    // unknown sequence
    else {
      const s1 = i
      const s2 = i

      // build key
      const keyToNewIndexMap: Map<PropertyKey, number> = new Map()
      for (i = s2; i <= e2; i++) {
        const nextChild = (c2[i] = normalizeVNode(c2[i]))
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i)
        }
      }

      let j
      let patched = 0
      const toBePatched = e2 - s2 + 1
      let moved = false
      let maxNewIndexSoFar = 0

      // patch and umount
      const newIndexToOldIndexMap = Array.from({ length: toBePatched }, () => 0)
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          // no need to patch
          umount(prevChild)
          continue
        }

        let newIndex
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        }
        else {
          // key-less node, try to locate a key-less node of the same type
          for (j = s2; j <= e2; j++) {
            if (
              newIndexToOldIndexMap[j - s2] === 0
              && isSameVNodeType(prevChild, c2[j] as VNode)
            ) {
              newIndex = j
              break
            }
          }
        }

        if (newIndex === undefined) {
          umount(prevChild)
        }
        else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          }
          else {
            moved = true
          }

          patch(
            prevChild,
            c2[newIndex] as VNode,
            container,
            null,
            parentComponent,
          )
          patched++
        }
      }

      // move and mount
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : EMPTY_ARR
      j = increasingNewIndexSequence.length - 1
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i
        const nextChild = c2[nextIndex] as VNode
        const anchorVNode = c2[nextIndex + 1] as VNode
        const anchor = nextIndex + 1 < l2 ? anchorVNode.el || anchorVNode.placeholder : null

        if (newIndexToOldIndexMap[i] === 0) {
          // mount
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
          )
        }
        else if (moved) {
          // move
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, MoveType.REORDER)
          }
          else {
            j--
          }
        }
      }
    }
  }

  const move: MoveFn = (
    vnode,
    container,
    anchor,
    moveType,
  ) => {
    const { el, type, children } = vnode

    if (type === Fragment) {
      hostInsert(el!, container, anchor)
      for (let i = 0; i < (children as VNode[]).length; i++) {
        move((children as VNode[])[i], container, anchor, moveType)
      }
      hostInsert(vnode.anchor!, container, anchor)
      return
    }

    hostInsert(el!, container, anchor)
  }

  const unmountChildren = (
    children: VNode[],
    start = 0,
    end = children.length,
  ) => {
    for (let i = start; i < end; i++) {
      umount(children[i])
    }
  }

  const mountChildren = (
    children: VNodeArrayChildren,
    container: RendererElement,
    start = 0,
    end = children.length,
  ) => {
    for (let i = start; i < end; i++) {
      const child = (children[i] = normalizeVNode(children[i]))
      patch(null, child, container)
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

// longest increasing subsequence
function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let idx, lastTailIdx, left, right, mid
  const len = arr.length
  for (idx = 0; idx < len; idx++) {
    const currentValue = arr[idx]
    if (currentValue !== 0) {
      lastTailIdx = result[result.length - 1]
      if (arr[lastTailIdx] < currentValue) {
        p[idx] = lastTailIdx
        result.push(idx)
        continue
      }
      left = 0
      right = result.length - 1
      while (left < right) {
        mid = (left + right) >> 1
        if (arr[result[mid]] < currentValue) {
          left = mid + 1
        }
        else {
          right = mid
        }
      }
      if (currentValue < arr[result[left]]) {
        if (left > 0) {
          p[idx] = result[left - 1]
        }
        result[left] = idx
      }
    }
  }
  left = result.length
  right = result[left - 1]
  while (left-- > 0) {
    result[left] = right
    right = p[right]
  }
  return result
}
