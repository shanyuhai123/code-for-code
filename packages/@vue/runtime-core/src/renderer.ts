import type { VNode } from './vnode'

export type ElementNamespace = 'svg' | 'mathml' | undefined

export interface Renderer<HostElement = RendererElement> {
  render: RootRenderFunction<HostElement>
}

export interface RendererOptions<
  HostNode = RendererNode,
  HostElement = RendererElement,
> {
  insert: (el: HostNode, parent: HostElement, anchor?: HostNode | null) => void
  remove: (el: HostNode) => void
  createElement: (
    type: string,
    namespace?: ElementNamespace
  ) => HostElement
  setElementText: (el: HostNode, text: string) => void
}

export interface RendererNode {
  [key: string | symbol]: any
}

export interface RendererElement extends RendererNode, HTMLElement {}

export type RootRenderFunction<HostElement = RendererElement> = (
  vnode: VNode | null,
  container: HostElement,
) => void

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
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    setElementText: hostSetElementText,
  } = options

  const patch = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
  ) => {
    if (n1 === null) {
      mountElement(n2, container)
    }
  }

  const mountElement = (vnode: VNode, container: RendererElement) => {
    const el = vnode.el = hostCreateElement(vnode.type as string)

    if (typeof vnode.children === 'string') {
      hostSetElementText(el, vnode.children)
    }

    hostInsert(el, container)
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
