import type { ComponentInternalInstance, Data } from './component'
import { shallowReactive } from '@vue/reactivity'
import { createInternalObject } from './internalObject'

export function initProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  isStateful: number,
) {
  const props: Data = {}
  const attrs: Data = createInternalObject()

  instance.propsDefaults = Object.create(null)

  if (isStateful) {
    instance.props = shallowReactive(props)
  }
  else {
    instance.props = props
  }

  instance.attrs = attrs
}
