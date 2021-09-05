import { effect } from '@vue/reactivity'
import { isArray } from '@vue/shared'
import { VNode } from './h'
import { patch } from './patch'

export function mount (vnode: VNode, container?: Element) {
  const el = vnode.el = document.createElement(vnode.tag)

  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key]
      if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), value)
      } else {
        el.setAttribute(key, value)
      }
    }
  }

  if (vnode.children) {
    if (typeof vnode.children === 'string') {
      el.textContent = vnode.children
    } else if (isArray(vnode.children)) {
      vnode.children.forEach(child => {
        mount(child, el)
      })
    }
  }

  container!.appendChild(el)
}

export function createApp (App: any) {
  let isMounted = false
  let prevVNode: VNode

  function _mount (query: string) {
    const container = document.querySelector(query)

    if (!container) {
      throw new Error('未找到挂载 DOM')
    }

    effect(() => {
      if (!isMounted) {
        prevVNode = App.render()
        mount(prevVNode, container)
        isMounted = true
      } else {
        const newVNode = App.render()
        patch(prevVNode, newVNode)
        prevVNode = newVNode
      }
    })
  }

  return {
    mount: _mount
  }
}
