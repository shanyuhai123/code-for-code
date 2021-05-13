import Vue from '../instance'

describe('Initialization', () => {
  it('root vue instance uid be 0', () => {
    expect(new Vue().uid).toBe(0)
  })
})
