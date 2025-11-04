import { ref } from '@vue/reactivity'
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

  it('child component props update should not lead to double update', async () => {
    const text = ref(0)
    const spy = vi.fn()

    const App = {
      render: () => {
        return h(Comp, { text: text.value })
      },
    }

    const Comp = {
      props: ['text'],
      render(this: any) {
        spy()
        return h('h1', this.text)
      },
    }

    const root = nodeOps.createElement('div')
    render(h(App), root)

    expect(inner(root)).toBe(`<h1>0</h1>`)
    expect(spy).toHaveBeenCalledTimes(1)
  })
})
