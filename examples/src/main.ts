import { reactive, effect, ref } from '@vue/reactivity'
import { createApp, h } from '@vue/runtime-core'

const count = ref(1)

const App = {
  data: reactive({
    count: 1
  }),
  render () {
    return h('button', {
      class: 'blue',
      onClick: () => {
        // this.data.count++
        count.value++
      }
    }, String(count.value))
  }
}

createApp(App).mount('#app')

// const state = reactive({
//   foo: 1,
//   bar: 2,
//   arr: [1, 2]
// })

// effect(() => {
//   (app as Element).innerHTML = state.foo
//   console.log(state.foo, state.bar)
// })

// setTimeout(() => {
//   state.foo = 100
//   state.arr.push(3)
// }, 2000)
