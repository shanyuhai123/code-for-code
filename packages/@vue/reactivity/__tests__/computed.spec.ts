import { computed } from '../src/computed'
import { reactive } from '../src/reactive'

describe('reactivity/computed', () => {
  it('should return updated value', () => {
    const value = reactive<{ foo?: number }>({})
    const cValue = computed(() => value.foo)
    expect(cValue.value).toBe(undefined)
    value.foo = 1
    expect(cValue.value).toBe(1)
  })

  it('should return updated multiple value', () => {
    const obj = reactive({
      foo: 1,
      bar: 2,
    })
    const cValue = computed(() => obj.foo + obj.bar)
    expect(cValue.value).toBe(3)
    obj.foo = 2
    expect(cValue.value).toBe(4)
    obj.bar = 5
    expect(cValue.value).toBe(7)
  })
})
