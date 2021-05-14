import Vue from '..'

describe('Initialization', () => {
  it('root vue instance uid be 0', () => {
    expect(new Vue()._uid).toBe(0)
  })
})
