import { effect, isRef, reactive, Ref, ref, toRef, toRefs } from '../src'

describe('reactivity/ref', () => {
  it('should hold a value', () => {
    const r = ref(1)

    expect(r.value).toBe(1)
    r.value = 10
    expect(r.value).toBe(10)
  })

  it('should be reactive', () => {
    const r = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = r.value
    })

    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    r.value = 10
    expect(calls).toBe(2)
    expect(dummy).toBe(10)
    r.value = 10
    expect(calls).toBe(2)
    expect(dummy).toBe(10)
  })

  it('should make nested properties reactive', () => {
    const r = ref({
      count: 0
    })
    let dummy
    effect(() => {
      dummy = r.value.count
    })

    expect(dummy).toBe(0)
    r.value.count = 10
    expect(dummy).toBe(10)
  })

  it('should work without initial value', () => {
    const r = ref()
    let dummy
    effect(() => {
      dummy = r.value
    })

    expect(dummy).toBe(undefined)
    r.value = 10
    expect(dummy).toBe(10)
  })

  it('should work like a normal property when nested in a reactive object', () => {
    const r = ref(1)
    const obj = reactive({
      r,
      b: {
        c: r
      }
    })
    let dummy1
    let dummy2
    effect(() => {
      dummy1 = obj.r
      dummy2 = obj.b.c
    })

    const assertDummiesEqualTo = (val: number) =>
      [dummy1, dummy2].forEach(dummy => expect(dummy).toBe(val))
    assertDummiesEqualTo(1)
    r.value++
    assertDummiesEqualTo(2)
    // @ts-ignore
    obj.b.c++
    assertDummiesEqualTo(3)
    // @ts-ignore
    obj.b.c++
    assertDummiesEqualTo(4)
  })

  it('should unwrap nested ref in types', () => {
    const a = ref(0)
    const b = ref(a)

    expect(typeof (b.value + 1)).toBe('number')
  })

  it('should unwrap nested values in types', () => {
    const a = {
      b: ref(0)
    }
    const c = ref(a)

    // @ts-ignore
    expect(typeof (c.value.b + 1)).toBe('number')
  })

  it('should not unwrap ref types nested inside arrays', () => {
    const arr = ref([1, ref(3)]).value

    expect(isRef(arr[0])).toBe(false)
    expect(isRef(arr[1])).toBe(true)
    expect((arr[1] as Ref).value).toBe(3)
  })

  it('should be isRef', () => {
    expect(isRef(0)).toBe(false)
    expect(isRef(ref(0))).toBe(true)
    expect(isRef({ value: 0 })).toBe(false)
  })

  test('toRef', () => {
    const a = reactive({
      x: 1
    })
    const x = toRef(a, 'x')

    expect(isRef(x)).toBe(true)
    expect(x.value).toBe(1)
    a.x = 2
    expect(x.value).toBe(2)
    x.value = 3
    expect(a.x).toBe(3)

    let dummyX
    effect(() => {
      dummyX = x.value
    })
    expect(dummyX).toBe(x.value)
    a.x = 4
    expect(dummyX).toBe(4)

    const r = { x: ref(1) }
    expect(toRef(r, 'x')).toBe(r.x)
  })

  test('toRefs', () => {
    const a = reactive({
      x: 1,
      y: 2
    })
    const { x, y } = toRefs(a)

    expect(isRef(x)).toBe(true)
    expect(isRef(y)).toBe(true)
    expect(x.value).toBe(1)
    expect(y.value).toBe(2)
    // source -> proxy
    a.x = 2
    a.y = 3
    expect(x.value).toBe(2)
    expect(y.value).toBe(3)
    // proxy -> source
    x.value = 3
    y.value = 4
    expect(a.x).toBe(3)
    expect(a.y).toBe(4)
    // effect
    let dummyX, dummyY
    effect(() => {
      dummyX = x.value
      dummyY = y.value
    })
    expect(dummyX).toBe(x.value)
    expect(dummyY).toBe(y.value)
    a.x = 4
    a.y = 5
    expect(dummyX).toBe(4)
    expect(dummyY).toBe(5)
  })

  test('toRefs should warn on plain object', () => {
    toRefs({})
    expect('toRefs() expects a reactive object').toHaveBeenWarned()
  })

  test('toRefs should warn on plain array', () => {
    toRefs([])
    expect('toRefs() expects a reactive object').toHaveBeenWarned()
  })

  test('toRefs reactive array', () => {
    const arr = reactive(['a', 'b', 'c'])
    const refs = toRefs(arr)

    expect(Array.isArray(refs)).toBe(true)

    refs[0].value = '1'
    expect(arr[0]).toBe('1')

    arr[1] = '2'
    expect(refs[1].value).toBe('2')
  })
})
