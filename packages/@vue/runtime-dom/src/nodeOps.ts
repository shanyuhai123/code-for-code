import type { RendererOptions } from '@vue/runtime-core'

export const svgNS = 'http://www.w3.org/2000/svg'
export const mathmlNS = 'http://www.w3.org/1998/Math/MathML'

const doc = (typeof document !== 'undefined' ? document : null) as Document

export const nodeOps: Omit<RendererOptions<Node, Element>, 'patchProp'> = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child as Node, anchor as Node || null)
  },
  remove: (el) => {
    (el as Node).parentNode?.removeChild(el as Node)
  },
  createComment: (text) => {
    return doc.createComment(text)
  },
  createText: (text) => {
    return doc.createTextNode(text)
  },
  createElement: (tag, namespace): Element => {
    const el = namespace === 'svg'
      ? doc.createElementNS(svgNS, tag)
      : namespace === 'mathml'
        ? doc.createElementNS(mathmlNS, tag)
        : doc.createElement(tag)

    return el
  },
  setText: (el, text) => {
    el.nodeValue = text
  },
  setElementText: (el, text) => {
    el.textContent = text
  },
  parentNode: node => node.parentNode as Element | null,
  nextSibling: node => node.nextSibling,
}
