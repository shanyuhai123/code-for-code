import { effect, reactive } from '@vue/reactivity'

const obj = reactive({
  text: 'Hello',
  num: 123,
})

effect(() => {
  document.body.innerHTML = obj.text
})

setTimeout(() => {
  obj.text = 'Hello Vue'
}, 1000)
