import type { RendererOptions } from '@vue/runtime-core'
import { patchAttr } from './modules/attrs'

type DOMRendererOptions = RendererOptions<Node, Element>

export const patchProp: DOMRendererOptions['patchProp'] = (
  el,
  key,
  prevValue,
  nextValue,
) => {
  patchAttr(el, key, nextValue)
}
