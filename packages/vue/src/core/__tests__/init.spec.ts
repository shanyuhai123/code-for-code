import Vue from '..'

describe('Initialization', () => {
  it('root vue instance uid be 0', () => {
    expect(new Vue()._uid).toBe(0)
  })

  it('$options', () => {
    const data = { a: 1 }
    const methods = { m1 () {} }
    const vm = new Vue({
      data,
      methods
    })

    expect((vm.$options as any).methods.m1).toEqual(methods.m1)
  })
})
