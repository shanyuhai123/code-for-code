import Vue from '..'

interface PropOptions {
  type: Function | Array<Function> | null
  required?: boolean
  default?: any
  validator?: Function
}

export type ComponentOptions = {
  componentId?: string

  // data
  data: Object | Function | void
  props?: {
    [key: string]: PropOptions
  }
  propsData?: Object
  computed?: {
    [key: string]: Function | {
      set?: Function
      get?: Function
      cache?: boolean
    }
  }
  methods?: {
    [key: string]: Function
  }

  // DOM
  el?: string | Element
  template?: string

  // lifecycle
  beforeCreate?: Function
  created?: Function
  beforeMount?: Function
  mounted?: Function
  beforeUpdate?: Function
  updated?: Function
  activated?: Function
  deactivated?: Function
  beforeDestroy?: Function
  destroyed?: Function
  errorCaptured?: () => boolean | void;
  serverPrefetch?: Function;

  // assets
  components?: {
    [key: string]: Vue
  }
  directives?: {
    [key: string]: Object
  }

  // component v-model customization
  model?: {
    prop?: string
    event?: string
  }

  // private
  _isComponent?: true

  [key: string]: any
}
