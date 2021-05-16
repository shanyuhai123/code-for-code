import Vue from '..'

describe('vue event bus', () => {
  ;let vm: Vue
  let spy: jest.Mock

  beforeEach(() => {
    vm = new Vue()
    spy = jest.fn()
  })

  it('$on', () => {
    vm.$on('hello', (...args: any[]) => {
      spy.apply(this, args)
    })
    vm.$emit('hello', 1, 2, 3)

    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(1, 2, 3)
  })

  it('$on multi event', () => {
    vm.$on('multi', (...args: any[]) => {
      spy.apply(this, args)
    })

    vm.$emit('multi', 1, 2, 3)
    expect(spy.mock.calls.length).toBe(1)

    vm.$emit('multi', 4, 5)
    expect(spy.mock.calls.length).toBe(2)
  })

  it('$once', () => {
    vm.$once('once', spy)

    vm.$emit('once')
    vm.$emit('once')
    expect(spy.mock.calls.length).toBe(1)
  })

  it('$off', () => {
    vm.$on('off1', spy)
    vm.$on('off2', spy)

    vm.$emit('off1')
    expect(spy.mock.calls.length).toBe(1)

    vm.$off()
    vm.$emit('off2')
    expect(spy.mock.calls.length).toBe(1)
  })

  it('$off event', () => {
    vm.$on('off1', spy)
    vm.$on('off2', spy)

    vm.$off('off1')
    vm.$emit('off1', 1, 2, 3)
    vm.$emit('off2', 4, 5, 6)
    expect(spy.mock.calls.length).toBe(1)
    expect(spy).toHaveBeenCalledWith(4, 5, 6)
  })
})
