import { reactive, readonly, shallowReactive, shallowReadonly } from '@vue/reactivity'
// import { createApp, h } from '@vue/runtime-core'

// const App = {
//   data: reactive({
//     count: 1
//   }),
//   render () {
//     return h('button', {
//       class: 'blue',
//       onClick: () => {
//         console.log(this.data)
//         this.data.count++
//       }
//     }, String(this.data.count))
//   }
// }

// createApp(App).mount('#app')

const state = shallowReadonly({
  // count: 0,
  foo: {
    bar: 'baz'
  }
})

state.foo.bar = 'hello world'

console.log(state.foo)
