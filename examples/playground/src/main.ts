import { effect, ref } from '@vue/reactivity'
import { h } from '@vue/runtime-core'
import { render } from '@vue/runtime-dom'

const style = document.createElement('style')
document.head.appendChild(style)
style.innerHTML = `
  .mounted {
    color: green;
    font-weight: bold;
  }
  .container {
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  button {
    padding: 8px 16px;
    margin: 10px 5px;
    cursor: pointer;
  }
`

const count = ref(0)

const Counter = {
  render(this: any) {
    const isMounted = this.$.isMounted

    return h('div', { class: 'container' }, [
      h('h1', 'isMounted Test'),
      h('div', { class: 'status' }, [
        h('p', `Count: ${count.value}`),
        h('p', `isMounted: ${isMounted}`),
      ]),
      h('div', [
        h('button', {
          onClick: () => {
            count.value++
          },
        }, 'Increment Count'),
        h('button', {
          onClick: () => {
            count.value--
          },
        }, 'Decrement Count'),
        h('button', {
          onClick: () => {
            count.value = 0
          },
        }, 'Reset'),
      ]),
    ])
  },
}

effect(() => {
  render(h(Counter), document.getElementById('app')!)
})
