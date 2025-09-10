import type { VNode } from '@vue/runtime-core'
import { effect, reactive } from '@vue/reactivity'
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
const vnode: VNode = {
  type: 'div',
  props: {
    id: 'hello',
    class: 'blue',
  },
  children: [
    {
      type: 'span',
      children: 'Hello',
    },
    {
      type: 'span',
      children: 'World',
    },
  ],
}

effect(() => {
  render(vnode, document.getElementById('app')!)
})

setTimeout(() => {
  obj.text = 'Hello World'
}, 1000)
