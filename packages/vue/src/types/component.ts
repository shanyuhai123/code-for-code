export interface Component extends Function {
  options: Object

  // lifecycle
  _init: Function

  // private properties
  _uid: string | number
}
