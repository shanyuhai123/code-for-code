import { effect, reactive, ref } from '@vue/reactivity'
import { Fragment, h } from '@vue/runtime-core'
import { render } from '@vue/runtime-dom'

const style = document.createElement('style')
document.head.appendChild(style)
style.innerHTML = `
  .blue {
    color: blue;
  }
`

const bool = ref(true)

effect(() => {
  const vnode = h('div', [
    h('button', {
      onClick: () => {
        bool.value = !bool.value
      },
    }, 'Click me'),
    bool.value ? 'Hello' : 'World',
    h(Fragment, bool.value
      ? [
          'Hello',
          'World',
        ]
      : []),
  ])

  render(vnode, document.getElementById('app')!)
})
