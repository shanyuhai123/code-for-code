import { effect, reactive, ref, watch } from '@vue/reactivity'

const count = ref(0)
// const obj = reactive({
//   text: 'Hello',
//   num: 123,
// })

watch(count, (newVal, oldVal) => {
  console.log(newVal, oldVal)
}, { immediate: true })

setTimeout(() => {
  count.value++
}, 1000)
