import { computed, effect, reactive } from '@vue/reactivity'

const obj = reactive({
  text: 'Hello',
  num: 123,
})

effect(() => {
  document.body.innerHTML = obj.text
})
const vNum = computed(() => obj.num)

// setTimeout(() => {
//   obj.text = 'Hello Vue'
// }, 1000)

// console.log(vNum.value)
// console.log(vNum.value)
console.log('vNum.value', vNum.value)
obj.num++
console.log('vNum.value2', vNum.value)
