import { effect } from '../src/effect'
import { reactive } from '../src/reactive'

describe('reactivity/effect', () => {
  it('should run the passed function once (wrapped by a effect)', () => {
    const fnSpy = vi.fn(() => {})
    effect(fnSpy)
    expect(fnSpy).toHaveBeenCalledTimes(1)
  })

  it('should observe basic properties', () => {
    let dummy
    const counter = reactive({ num: 0 })
    effect(() => dummy = counter.num)

    expect(dummy).toBe(0)
    counter.num++
    expect(dummy).toBe(1)
  })

  // 值未改变时不触发
  it('should not trigger when value is not changed', () => {
    let dummy
    const fnSpy = vi.fn()
    const counter = reactive({ num: 0 })
    effect(() => {
      fnSpy()
      dummy = counter.num
    })

    expect(dummy).toBe(0)
    expect(fnSpy).toHaveBeenCalledTimes(1)
    counter.num = 0
    expect(dummy).toBe(0)
    expect(fnSpy).toHaveBeenCalledTimes(1)
  })

  it('should observe multiple properties', () => {
    let dummy
    const counter = reactive({ num1: 0, num2: 0 })
    effect(() => dummy = counter.num1 + counter.num1 + counter.num2)

    expect(dummy).toBe(0)
    counter.num1 = counter.num2 = 7
    expect(dummy).toBe(21)
  })

  it('should handle multiple effects', () => {
    let dummy1, dummy2
    const counter = reactive({ num: 0 })
    effect(() => dummy1 = counter.num)
    effect(() => dummy2 = counter.num * 2)

    expect(dummy1).toBe(0)
    expect(dummy2).toBe(0)
    counter.num = 1
    expect(dummy1).toBe(1)
    expect(dummy2).toBe(2)
  })

  it('should observe nested properties', () => {
    let dummy
    const counter = reactive({ nested: { num: 0 } })
    effect(() => dummy = counter.nested.num)

    expect(dummy).toBe(0)
    counter.nested.num++
    expect(dummy).toBe(1)
  })

  it('should observe delete operations', () => {
    let dummy
    const obj = reactive<{ prop?: string }>({ prop: 'value' })
    effect(() => dummy = obj.prop)

    expect(dummy).toBe('value')
    delete obj.prop
    expect(dummy).toBe(undefined)
  })

  it('should observe has operations', () => {
    let dummy
    const obj = reactive<{ prop?: string | number }>({ prop: 'value' })
    effect(() => (dummy = 'prop' in obj))

    expect(dummy).toBe(true)
    delete obj.prop
    expect(dummy).toBe(false)
    obj.prop = 'hi'
    expect(dummy).toBe(true)
  })

  it('should not track non-reactive properties', () => {
    const obj: any = reactive({})
    let has = false
    const fnSpy = vi.fn()
    effect(() => {
      fnSpy()
      has = Object.prototype.hasOwnProperty.call(obj, 'foo')
    })

    expect(fnSpy).toHaveBeenCalledTimes(1)
    expect(has).toBe(false)
    delete obj.foo
    expect(fnSpy).toHaveBeenCalledTimes(1)
    expect(has).toBe(false)
  })

  it('should observe function call chains', () => {
    let dummy
    const counter = reactive({ num: 0 })
    effect(() => dummy = getNum())

    function getNum() {
      return counter.num
    }

    expect(dummy).toBe(0)
    counter.num = 2
    expect(dummy).toBe(2)
  })

  it('should observe object keys', () => {
    let dummy: string[] | undefined
    const obj: any = reactive({ foo: 'bar' })
    effect(() => dummy = Object.keys(obj))

    expect(dummy).toEqual(['foo'])
    obj.bar = 'baz'
    expect(dummy).toEqual(['foo', 'bar'])
    delete obj.foo
    expect(dummy).toEqual(['bar'])
  })
})
