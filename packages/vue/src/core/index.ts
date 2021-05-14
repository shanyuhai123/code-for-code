import { $emit, $off, $on, $once } from './instance/events'
import { _init } from './instance/init'
import { ComponentOptions } from './types/options'

class Vue {
  _uid: number = 0
  _events: {
    [key: string]: any[] | null
  } = {}

  _isVue: boolean = false

  $options: Object = {}

  _hasHookEvent: boolean = false

  constructor (options: ComponentOptions = { data: {} }) {
    this._init(options)
  }

  // init
  _init (this: Vue, options: ComponentOptions): void {
    return _init(this, options)
  }

  // events
  $on (this: Vue, event: string, fn: Function): Vue {
    return $on(this, event, fn)
  }

  $once (this: Vue, event: string, fn: Function): Vue {
    return $once(this, event, fn)
  }

  $off (this: Vue, event?: string, fn?: Function): Vue {
    return $off(this, event, fn)
  }

  $emit (this: Vue, event: string, ...args: any[]): Vue {
    return $emit(this, event, ...args)
  }
}

export default Vue
