import type { RendererOptions } from '@vue/runtime-core'
import { isOn } from '@vue/shared'
import { patchAttr } from './modules/attrs'
import { patchClass } from './modules/class'
import { patchEvent } from './modules/events'
import { patchDOMProp } from './modules/props'

type DOMRendererOptions = RendererOptions<Node, Element>

export const patchProp: DOMRendererOptions['patchProp'] = (
  el,
  key,
  prevValue,
  nextValue,
) => {
  if (key === 'class') {
    patchClass(el, nextValue)
  }
  else if (isOn(key)) {
    patchEvent(el, key, prevValue, nextValue)
  }
  else if (shouldSetAsProp(el, key)) {
    patchDOMProp(el, key, nextValue)
  }
  else {
    patchAttr(el, key, nextValue)
  }
}

function shouldSetAsProp(el: Element, key: string) {
  if (key === 'form') {
    return false
  }

  return key in el
}
