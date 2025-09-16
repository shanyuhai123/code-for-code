import { effect, reactive } from '@vue/reactivity'
import { h } from '@vue/runtime-core'
import { render } from '@vue/runtime-dom'

const style = document.createElement('style')
document.head.appendChild(style)
style.innerHTML = `
  .blue {
    color: blue;
  }
`

// const count = ref(0)
const obj: any = reactive({
  text: 'Hello',
  num: 123,
})
const vnode = h('div', [
  h('input', {
    id: 'my-input1',
    type: 'text',
    disabled: true,
    value: 'foo',
  }),
  h('input', {
    id: 'my-input2',
    type: 'text',
    disabled: false,
    value: 'foo',
  }),
])

effect(() => {
  render(vnode, document.getElementById('app')!)
})

setTimeout(() => {
  obj.text = 'Hello World'
}, 1000)
