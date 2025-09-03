import { effect, reactive, ref } from '@vue/reactivity'

const count = ref(0)
// const obj = reactive({
//   text: 'Hello',
//   num: 123,
// })

effect(() => {
  document.body.innerHTML = `${count.value}`
})

setTimeout(() => {
  count.value++
}, 1000)
