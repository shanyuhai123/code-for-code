import type { VNode } from '@vue/runtime-core'
import { effect, reactive } from '@vue/reactivity'
import { render } from '@vue/runtime-dom'

// const count = ref(0)
const obj: any = reactive({
  text: 'Hello',
  num: 123,
})
const vnode: VNode = {
  type: 'div',
  children: 'Hello',
  el: null,
}

effect(() => {
  render(vnode, document.getElementById('app')!)
})

setTimeout(() => {
  obj.text = 'Hello World'
}, 1000)
