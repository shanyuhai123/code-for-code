import type { Renderer, RootRenderFunction } from '@vue/runtime-core'
import { createRenderer } from '@vue/runtime-core'
import { extend } from '@vue/shared'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const rendererOptions = extend({ patchProp }, nodeOps)

let renderer: Renderer<Element>

function ensureRenderer() {
  return (
    renderer
    || (renderer = createRenderer<Node, Element>(rendererOptions))
  )
}

export const render = ((...args) => {
  ensureRenderer().render(...args)
}) as RootRenderFunction<Element>
