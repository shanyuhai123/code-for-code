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

const keyedToggle = ref(true)
const listA = [
  { key: 'A', text: 'A' },
  { key: 'B', text: 'B' },
  { key: 'C', text: 'C' },
  { key: 'D', text: 'D' },
]
const listB = [
  { key: 'B', text: 'B' },
  { key: 'D', text: 'D' },
  { key: 'A', text: 'A' },
  { key: 'C', text: 'C' },
]
const keyedList = ref(listA)

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

    h('div', [
      h('button', {
        onClick: () => {
          keyedToggle.value = !keyedToggle.value
          keyedList.value = keyedToggle.value ? listA : listB
        },
      }, 'Toggle keyed order'),
      h('ul', keyedList.value.map(item => h('li', { key: item.key }, item.text))),
    ]),
  ])

  render(vnode, document.getElementById('app')!)
})
