import type { RootRenderFunction } from '@vue/runtime-core'
import type { TestElement } from './nodeOps'
import { createRenderer } from '@vue/runtime-core'
import { extend } from '@vue/shared'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const { render: baseRender } = createRenderer(
  extend({ patchProp }, nodeOps as any),
)

export const render = baseRender as RootRenderFunction<TestElement>

export * from './nodeOps'
export * from './serialize'
export * from '@vue/runtime-core'
