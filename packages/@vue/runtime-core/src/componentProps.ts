import type { ComponentInternalInstance, Data } from './component'
import { shallowReactive } from '@vue/reactivity'
import { isReservedProp } from '@vue/shared'
import { createInternalObject } from './internalObject'

export function initProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  isStateful: number,
) {
  const props: Data = {}
  const attrs: Data = createInternalObject()

  instance.propsDefaults = Object.create(null)

  setFullProps(instance, rawProps, props, attrs)

  if (isStateful) {
    instance.props = shallowReactive(props)
  }
  else {
    instance.props = props
  }

  instance.attrs = attrs
}

function setFullProps(
  instance: ComponentInternalInstance,
  rawProps: Data | null,
  props: Data,
  attrs: Data,
) {
  if (rawProps) {
    for (const key in rawProps) {
      if (isReservedProp(key)) {
        continue
      }

      const value = rawProps[key]

      if (!(key in attrs) || value !== attrs[key]) {
        attrs[key] = value
      }
    }
  }
}
