import { TrackOpTypes, TriggerOpTypes } from './constants'
import { track, trigger } from './dep'

class BaseReactiveHandler implements ProxyHandler<object> {
  constructor(
    public isReadonly: boolean,
  ) {}

  get(target: object, key: string | symbol, receiver: object): any {
    const res = Reflect.get(target, key, receiver)

    track(target, TrackOpTypes.GET, key)

    return res
  }
}

class MutableReactiveHandler extends BaseReactiveHandler {
  constructor() {
    super(false)
  }

  set(
    target: object,
    key: string | symbol,
    value: unknown,
    receiver: object,
  ) {
    const res = Reflect.set(target, key, value, receiver)

    trigger(target, TriggerOpTypes.SET, key)

    return res
  }
}

export const mutableHandlers: ProxyHandler<object> = new MutableReactiveHandler()
