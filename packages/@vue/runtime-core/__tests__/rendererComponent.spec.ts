import { h, serializeInner as inner, nodeOps, render } from '@vue/runtime-test'

describe('renderer: component', () => {
  it('should create an Component with props', () => {
    const Comp = {
      render: () => {
        return h('div')
      },
    }

    const root = nodeOps.createElement('div')
    render(h(Comp, { id: 'foo', class: 'bar' }), root)
    expect(inner(root)).toBe(`<div id="foo" class="bar"></div>`)
  })
})
