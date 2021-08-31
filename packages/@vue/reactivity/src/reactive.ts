import { getDep } from './dep'

const reactiveHandlers: ProxyHandler<any> = {
  get (target, key, receiver) {
    const dep = getDep(target, key)
    dep.depend()
    return Reflect.get(target, key, receiver)
  },
  set (target, key, value, receiver) {
    const dep = getDep(target, key)
    const ret = Reflect.set(target, key, value, receiver)
    dep.notify()
    return ret
  }
}

export function reactive (raw) {
  return new Proxy(raw, reactiveHandlers)
}
