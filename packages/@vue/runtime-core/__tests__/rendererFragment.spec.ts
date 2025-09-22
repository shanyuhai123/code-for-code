import type { TestElement } from '@vue/runtime-test'
import { h, nodeOps, render, serializeInner } from '@vue/runtime-test'
import { Fragment } from '../src/vnode'

describe('renderer: fragment', () => {
  it('explicitly create fragments', () => {
    const root = nodeOps.createElement('div')
    render(h('div', [h(Fragment, [h('div', 'one'), 'two'])]), root)
    const parent = root.children[0] as TestElement
    expect(serializeInner(parent)).toBe(`<div>one</div>two`)
  })
})
