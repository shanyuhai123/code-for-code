import type { ComponentInternalInstance } from './component'
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
