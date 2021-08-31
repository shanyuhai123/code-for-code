import { reactive } from '@vue/reactivity'
import { createApp, h } from '@vue/runtime-core'

const App = {
  data: reactive({
    count: 1
  }),
  render () {
    return h('button', {
      class: 'blue',
      onClick: () => {
        console.log(this.data)
        this.data.count++
      }
    }, String(this.data.count))
  }
}

createApp(App).mount('#app')
