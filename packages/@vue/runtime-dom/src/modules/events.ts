import { hyphenate } from '@vue/shared'

interface Invoker extends EventListener {
  value: EventValue
  attached: number
}

type EventValue = Function | Function[]

export function addEventListener(
  el: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions,
): void {
  el.addEventListener(event, handler, options)
}

export function removeEventListener(
  el: Element,
  event: string,
  handler: EventListener,
  options?: EventListenerOptions,
): void {
  el.removeEventListener(event, handler, options)
}

const veiKey: unique symbol = Symbol('_vei')

export function patchEvent(
  el: Element & { [veiKey]?: Record<string, Invoker | undefined> },
  rawName: string,
  prevValue: EventValue | null,
  nextValue: EventValue | unknown,
) {
  const invokers = el[veiKey] || (el[veiKey] = {})
  const existingInvoker = invokers[rawName]

  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue as EventValue
  }
  else {
    const [name] = parseName(rawName)

    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue as EventValue)
      addEventListener(el, name, invoker)
    }
    else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker)
      invokers[rawName] = undefined
    }
  }
}

function parseName(name: string) {
  return [hyphenate(name.slice(2))]
}

let cachedNow: number = 0
const p = Promise.resolve()
const getNow = () => cachedNow || (p.then(() => (cachedNow = 0)), (cachedNow = Date.now()))

function createInvoker(value: EventValue): Invoker {
  const invoker = ((e: Event & { _vts?: number }) => {
    if (!e._vts) {
      e._vts = Date.now()
    }
    else if (e._vts <= invoker.attached) {
      return
    }

    const { value } = invoker
    if (Array.isArray(value)) {
      for (const handler of value) {
        handler(e)
      }
    }
    else {
      value(e)
    }
  }) as Invoker

  invoker.value = value
  invoker.attached = getNow()

  return invoker
}
