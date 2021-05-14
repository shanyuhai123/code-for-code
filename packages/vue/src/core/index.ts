import { hookRE } from '@/shared/constants'
import { ComponentOptions } from './types/options'
import { invokeWithErrorHandling, toArray } from './util'

let uid = 0
class Vue {
  _uid: number = 0
  _events: {
    [key: string]: any[] | null
  } = {}

  _hasHookEvent: boolean = false

  constructor (options?: ComponentOptions) {
    this.init(options)
  }

  private init (options?: ComponentOptions) {
    this._uid = uid++
  }

  $on (this: Vue, event: string, fn: Function): Vue {
    const vm = this

    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        vm.$on(event[i], fn)
      }
    } else {
      ;(vm._events[event] || (vm._events[event] = [])).push(fn)

      if (hookRE.test(event)) {
        vm._hasHookEvent = true
      }
    }

    return vm
  }

  $once (this: Vue, event: string, fn: Function): Vue {
    const vm = this

    function on () {
      vm.$off(event, fn)
      fn.apply(vm, arguments)
    }
    on.fn = fn
    vm.$on(event, on)

    return vm
  }

  $off (this: Vue, event?: string, fn?: Function): Vue {
    const vm = this

    // remove all
    if (!event) {
      vm._events = Object.create(null)
      return vm
    }

    // array item exec
    if (Array.isArray(event)) {
      for (let i = 0; i < event.length; i++) {
        vm.$off(event[i], fn)
      }

      return vm
    }

    // specific event
    const cbs = vm._events[event]
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null
      return vm
    }
    // specific handler
    let cb
    let i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }

    return vm
  }

  $emit (this: Vue, event: string, ...args: any[]): Vue {
    const vm = this

    let cbs = vm._events[event]

    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs

      const info = `event handler for "${event}"`
      for (let i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info)
      }
    }

    return vm
  }
}

export default Vue
