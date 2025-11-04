import type { AppContext } from './apiCreateApp'
import type { ComponentInternalInstance, ConcreteComponent, Data } from './component'
import { shallowReactive } from '@vue/reactivity'
import { camelize, EMPTY_ARR, EMPTY_OBJ, hasOwn, hyphenate, isArray, isFunction, isObject, isReservedProp } from '@vue/shared'
import { toRaw } from 'packages/@vue/reactivity/src/reactive'
import { createInternalObject } from './internalObject'

export type ComponentPropsOptions<P = Data>
  = | ComponentObjectPropsOptions<P>
    | string[]

export type ComponentObjectPropsOptions<P = Data> = {
  [K in keyof P]: Prop<P[K]> | null
}

export type Prop<T, D = T> = PropOptions<T, D> | PropType<T>

export interface PropOptions<T = any, D = T> {
  type?: PropType<T> | true | null
  required?: boolean
  default?: D | null | undefined | object
  validator?: (value: unknown, props: Data) => boolean
  /**
   * @internal
   */
  skipCheck?: boolean
  /**
   * @internal
   */
  skipFactory?: boolean
}

export type PropType<T> = PropConstructor<T> | (PropConstructor<T> | null)[]

type PropConstructor<T = any>
  = | { new (...args: any[]): T & {} }
    | { (): T }
    | PropMethod<T>

type PropMethod<T, TConstructor = any> = [T] extends [
  ((...args: any) => any) | undefined,
] // if is function with args, allowing non-required functions
  ? { new (): TConstructor, (): T, readonly prototype: TConstructor } // Create Function like constructor
  : never

enum BooleanFlags {
  shouldCast,
  shouldCastTrue,
}

type NormalizedProp = PropOptions & {
  [BooleanFlags.shouldCast]?: boolean
  [BooleanFlags.shouldCastTrue]?: boolean
}

export type NormalizedProps = Record<string, NormalizedProp>
export type NormalizedPropsOptions = [NormalizedProps, string[]] | []

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
  const [options, needCastKeys] = instance.propsOptions
  let hasAttrsChanged = false
  let rawCastValues: Data | undefined

  if (rawProps) {
    for (const key in rawProps) {
      if (isReservedProp(key)) {
        continue
      }

      const value = rawProps[key]
      let camelKey
      if (options && hasOwn(options, (camelKey = camelize(key)))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value
        }
        else {
          ;(rawCastValues || (rawCastValues = {}))[camelKey] = value
        }
      }
      else {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value
          hasAttrsChanged = true
        }
      }
    }
  }

  if (needCastKeys) {
    const rawCurrentProps = toRaw(props)
    const castValues = rawCastValues || EMPTY_OBJ

    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i]
      props[key] = resolvePropValue(
        options!,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key),
      )
    }
  }

  return hasAttrsChanged
}

function resolvePropValue(
  options: NormalizedProps,
  props: Data,
  key: string,
  value: unknown,
  instance: ComponentInternalInstance,
  isAbsent: boolean,
) {
  const opt = options[key]
  if (opt != null) {
    const hasDefault = hasOwn(opt, 'default')
    if (hasDefault && value === undefined) {
      const defaultValue = opt.default

      if (opt.type !== Function && isFunction(defaultValue)) {
        value = defaultValue.call(null, props)
      }
      else {
        value = defaultValue
      }
    }
    if (opt[BooleanFlags.shouldCast]) {
      if (isAbsent && !hasDefault) {
        value = false
      }
      else if (
        opt[BooleanFlags.shouldCastTrue]
        && (value === '' || value === hyphenate(key))
      ) {
        value = true
      }
    }
  }
  return value
}

export function normalizePropsOptions(
  comp: ConcreteComponent,
  appContext: AppContext,
) {
  const cache = appContext.propsCache
  const cached = cache.get(comp)
  if (cached) {
    return cached
  }

  const raw = comp.props
  const normalized: NormalizedPropsOptions[0] = {}
  const needCastKeys: NormalizedPropsOptions[1] = []

  if (!raw) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR as any)
    }
    return EMPTY_ARR as any
  }

  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i])

      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ
      }
    }
  }

  const res: NormalizedPropsOptions = [normalized, needCastKeys]
  if (isObject(comp)) {
    cache.set(comp, res)
  }
  return res
}

function validatePropName(key: string) {
  if (key[0] !== '$' && !isReservedProp(key)) {
    return true
  }
  return false
}
