import type { RendererOptions } from '@vue/runtime-core'
import { patchDOMProp } from './modules/props'

type DOMRendererOptions = RendererOptions<Node, Element>

export const patchProp: DOMRendererOptions['patchProp'] = (
  el,
  key,
  prevValue,
  nextValue,
) => {
  patchDOMProp(el, key, nextValue)
  // patchAttr(el, key, nextValue)
}
