interface PropOptions {
  type: Function | Array<Function> | null
  required?: boolean
  default?: any
  validator?: Function
}

export interface ComponentOptions {
  data: Object | Function | void
  props?: {
    [key: string]: PropOptions
  }
}
