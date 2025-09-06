import { effect, reactive, ref, watch } from '@vue/reactivity'

// const count = ref(0)
const obj: any = reactive({
  text: 'Hello',
  num: 123,
})

effect(() => {
  console.log('keys', Object.keys(obj))
})

setTimeout(() => {
  obj.abc = 123
}, 1000)
