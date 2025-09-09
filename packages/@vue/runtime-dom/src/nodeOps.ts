import type { RendererElement, RendererOptions } from '@vue/runtime-core'

export const svgNS = 'http://www.w3.org/2000/svg'
export const mathmlNS = 'http://www.w3.org/1998/Math/MathML'

const doc = (typeof document !== 'undefined' ? document : null) as Document

export const nodeOps: RendererOptions<Node, Element> = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child as Node, anchor as Node || null)
  },
  remove: (el) => {
    (el as Node).parentNode?.removeChild(el as Node)
  },
  createElement: (tag, namespace) => {
    const el = namespace === 'svg'
      ? doc.createElementNS(svgNS, tag)
      : namespace === 'mathml'
        ? doc.createElementNS(mathmlNS, tag)
        : doc.createElement(tag)

    return el as RendererElement
  },
  setElementText: (el, text) => {
    el.textContent = text
  },
}
