import { isArray } from '@vue/shared'
import { VNode } from './h'
import { mount } from './vnode'

export function patch (n1: VNode, n2: VNode) {
  if (n1.tag === n2.tag) {
    const el = n2.el = n1.el

    // props
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    // props 新增或更新
    for (const prop in newProps) {
      const oldVal = oldProps[prop]
      const newVal = newProps[prop]

      if (oldVal !== newVal) {
        el?.setAttribute(prop, newVal)
      }
    }
    // props 删除
    for (const prop in oldProps) {
      if (!(prop in newProps)) {
        el?.removeAttribute(prop)
      }
    }

    // children
    const oldChildren = n1.children
    const newChildren = n2.children
    if (typeof newChildren === 'string') {
      if (typeof oldChildren === 'string') {
        if (oldChildren !== newChildren) {
          el!.textContent = newChildren
        }
      } else {
        el!.textContent = newChildren
      }
    } else if (isArray(newChildren)) {
      if (typeof oldChildren === 'string') {
        el!.innerHTML = ''
        newChildren.forEach(child => {
          mount(child, el)
        })
      } else if (isArray(oldChildren)) {
        const commonLength = Math.min(oldChildren.length, newChildren.length)

        for (let i = 0; i < commonLength; i++) {
          patch(oldChildren[i], newChildren[i])
        }

        if (newChildren.length > oldChildren.length) {
          // add child
          newChildren.slice(oldChildren.length).forEach(child => {
            mount(child, el)
          })
        } else if (newChildren.length < oldChildren.length) {
          // remove child
          oldChildren.slice(newChildren.length).forEach(child => {
            el!.removeChild(child)
          })
        }
      }
    }
  } else {
    // ...
  }
}
