import type { ComponentInternalInstance, Data } from './component'
import type { VNode } from './vnode'
import { ShapeFlags } from '@vue/shared'
import { cloneVNode, Comment, createVNode, normalizeVNode } from './vnode'

export function renderComponentRoot(instance: ComponentInternalInstance): VNode {
  const { vnode, render, renderCache, proxy, attrs, props, data, ctx } = instance

  let result: VNode
  let fallthroughAttrs
  try {
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      result = normalizeVNode(
        render!.call(
          proxy,
          proxy!,
          renderCache,

          props,
          data,
          ctx,
        ),
      )
      fallthroughAttrs = attrs
    }
    else {
      result = createVNode(Comment)
    }
  }
  catch {
    result = createVNode(Comment)
  }

  let root = result

  if (fallthroughAttrs) {
    const keys = Object.keys(fallthroughAttrs)
    const { shapeFlag } = root

    if (keys.length) {
      if (shapeFlag & (ShapeFlags.ELEMENT | ShapeFlags.COMPONENT)) {
        root = cloneVNode(root, fallthroughAttrs)
      }
    }
  }

  result = root

  return result
}

export function shouldUpdateComponent(prevVNode: VNode, nextVNode: VNode) {
  const { props: prevProps, children: prevChildren } = prevVNode
  const { props: nextProps, children: nextChildren } = nextVNode

  if (prevChildren || nextChildren) {
    if (!nextChildren || !(nextChildren as any).$stable) {
      return true
    }
  }

  if (prevProps === nextProps) {
    return false
  }

  if (!nextProps) {
    return true
  }

  return hasPropsChanged(prevProps as Data, nextProps)
}

function hasPropsChanged(prevProps: Data, nextProps: Data): boolean {
  const nextKeys = Object.keys(nextProps)

  if (nextKeys.length !== Object.keys(prevProps).length)
    return true

  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i]
    if (nextProps[key] !== prevProps[key])
      return true
  }

  return false
}
