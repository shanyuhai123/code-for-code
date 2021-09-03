import { isReactive, isRef, markRaw, reactive, ref, toRaw } from '../src'

describe('reactivity/reactive', () => {
  test('Objec', () => {
    const original = { foo: 1 }
    const observed = reactive(original)

    expect(observed).not.toBe(original)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(original)).toBe(false)

    // get
    expect(observed.foo).toBe(1)
    // has
    expect('foo' in observed).toBe(true)
    // ownKeys
    expect(Object.keys(observed)).toEqual(['foo'])
  })

  test('nested reactives', () => {
    const original = {
      nested: {
        foo: 1
      },
      array: [{ bar: 2 }]
    }
    const observed = reactive(original)

    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  })

  test('observed value should proxy mutations to original (Object)', () => {
    const original: any = { foo: 1 }
    const observed = reactive(original)

    // set
    observed.bar = 1
    expect(observed.bar).toBe(1)
    expect(original.bar).toBe(1)
    // delete
    delete observed.foo
    expect('foo' in observed).toBe(false)
    expect('foo' in original).toBe(false)
  })

  test('original value change should reflec in observed value (object)', () => {
    const original: any = { foo: 1 }
    const observed = reactive(original)

    // set
    original.foo = 2
    expect(original.foo).toBe(2)
    expect(observed.foo).toBe(2)
    // delete
    delete original.foo
    expect('foo' in original).toBe(false)
    expect('foo' in observed).toBe(false)
  })

  test('setting a property with an unobserved value should wrap with reactive', () => {
    const observed = reactive<{ foo?: object }>({})
    const raw = {}
    observed.foo = raw

    expect(observed.foo).not.toBe(raw)
    expect(isReactive(observed.foo)).toBe(true)
  })

  test('observing the same value multiple times should return the same proxy', () => {
    const original = { foo: 1 }
    const observed1 = reactive(original)
    const observed2 = reactive(observed1)

    expect(observed2).toBe(observed1)
  })

  test('should not pollute original object with Proxies', () => {
    const original: any = { foo: 1 }
    const original2 = { bar: 2 }
    const observed = reactive(original)
    const observed2 = reactive(original2)
    observed.bar = observed2

    expect(observed.bar).toBe(observed2)
    expect(original.bar).toBe(original2)
  })

  test('toRaw', () => {
    const original = { foo: 1 }
    const observed = reactive(original)

    expect(toRaw(observed)).toBe(original)
    expect(toRaw(original)).toBe(original)
  })

  test('toRaw on object using reactive as prototype', () => {
    const original = reactive({})
    const obj = Object.create(original)
    const raw = toRaw(obj)
    expect(raw).toBe(obj)
    expect(raw).not.toBe(toRaw(original))
  })

  test('should not unwrap Ref<T>', () => {
    const refNumber = ref(1)
    const observedNumberRef = reactive(refNumber)
    const observedObjectRef = reactive(ref({ foo: 1 }))

    expect(isRef(observedNumberRef)).toBe(true)
    expect(isRef(observedObjectRef)).toBe(true)
  })

  test('non-observable values', () => {
    const assertValue = (value: any) => {
      reactive(value)
      expect(
        `value cannot be made reactive: ${String(value)}`
      ).toHaveBeenWarnedLast()
    }

    assertValue(1)
    assertValue('foo')
    assertValue(false)
    assertValue(null)
    assertValue(undefined)
    const s = Symbol('foo')
    assertValue(s)

    const p = Promise.resolve()
    expect(reactive(p)).toBe(p)
    const pattern = 'foo'
    const r = new RegExp(pattern)
    expect(reactive(r)).toBe(r)
    const d = new Date()
    expect(reactive(d)).toBe(d)
  })

  test('markRaw', () => {
    const obj = reactive({
      foo: { a: 1 },
      bar: markRaw({ b: 2 })
    })

    expect(isReactive(obj)).toBe(true)
    expect(isReactive(obj.bar)).toBe(false)
  })

  test('should not observe non-extensible objects', () => {
    const obj = reactive({
      foo: Object.preventExtensions({ a: 1 }),
      bar: Object.freeze({ a: 1 }),
      baz: Object.seal({ a: 1 })
    })

    expect(isReactive(obj.foo)).toBe(false)
    expect(isReactive(obj.bar)).toBe(false)
    expect(isReactive(obj.baz)).toBe(false)
  })

  test('should not observe objects with __v_skip', () => {
    const original = {
      foo: 1,
      __v_skip: true
    }
    const observed = reactive(original)

    expect(isReactive(observed)).toBe(false)
  })
})
