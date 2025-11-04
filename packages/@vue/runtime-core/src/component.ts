import type { AppContext } from './apiCreateApp'
import type { ComponentOptions } from './componentOptions'
import type { ComponentPropsOptions, NormalizedPropsOptions } from './componentProps'
import type { ComponentPublicInstance } from './componentPublicInstance'
import type { VNode, VNodeChild } from './vnode'
import { EffectScope } from '@vue/reactivity'
import { EMPTY_OBJ, NOOP, ShapeFlags } from '@vue/shared'
import { createAppContext } from './apiCreateApp'
import { initProps, normalizePropsOptions } from './componentProps'
import { PublicInstanceProxyHandlers } from './componentPublicInstance'

export type Data = Record<string, unknown>

export interface InternalRenderFunction {
  (
    ctx: ComponentPublicInstance,
    cache: ComponentInternalInstance['renderCache'],

    $props: ComponentInternalInstance['props'],
    $data: ComponentInternalInstance['data'],
    $options: ComponentInternalInstance['ctx'],
  ): VNodeChild
}

export interface ComponentInternalInstance {
  uid: number
  type: ConcreteComponent
  parent: ComponentInternalInstance | null
  root: ComponentInternalInstance
  appContext: AppContext

  vnode: VNode
  next: VNode | null

  render: InternalRenderFunction | null
  ids: [string, number, number]
  scope: EffectScope
  accessCache: Data | null
  renderCache: (Function | VNode | undefined)[]

  propsOptions: NormalizedPropsOptions

  proxy: ComponentPublicInstance | null

  // state
  ctx: Data
  data: Data
  props: Data
  attrs: Data

  propsDefaults: Data

  // lifecycle
  isMounted: boolean
}

export interface FunctionalComponent<
  P = {},
> {
  (
    props: P
  ): any
  props?: ComponentPropsOptions<P>
}

export type ConcreteComponent<
  Props = {},
>
  = | FunctionalComponent<Props>
    | ComponentOptions<Props>

export type Component
  = | ConcreteComponent

const emptyAppContext = createAppContext()

let uid = 0

export function createComponentInstance(
  vnode: VNode,
  parent: ComponentInternalInstance | null,
) {
  const type = vnode.type as ConcreteComponent
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext

  const instance: ComponentInternalInstance = {
    uid: uid++,

    type,
    vnode,
    parent,
    appContext,
    root: null!,
    next: null,

    ids: parent ? parent.ids : ['', 0, 0],
    accessCache: null!,
    renderCache: [],

    scope: new EffectScope(true),
    render: null,
    proxy: null,

    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,

    propsOptions: normalizePropsOptions(type, appContext),
    propsDefaults: EMPTY_OBJ,

    isMounted: false,
  }

  instance.ctx = { _: instance }
  instance.root = parent ? parent.root : instance

  return instance
}

export function isStatefulComponent(
  instance: ComponentInternalInstance,
): number {
  return instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
}

export function setupComponent(instance: ComponentInternalInstance) {
  const { props } = instance.vnode
  const isStateful = isStatefulComponent(instance)

  initProps(instance, props, isStateful)

  const setupResult = isStateful ? setupStatefulComponent(instance) : undefined

  return setupResult
}

function setupStatefulComponent(instance: ComponentInternalInstance) {
  instance.accessCache = Object.create(null)
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers)

  finishComponentSetup(instance)
}

type CompileFunction = (
  template: string | object,
) => InternalRenderFunction

let compile: CompileFunction | undefined

export function finishComponentSetup(instance: ComponentInternalInstance) {
  const Component = instance.type as ComponentOptions

  if (!instance.render) {
    if (compile && !Component.render) {
      const template = Component.template

      if (template) {
        Component.render = compile(template)
      }
    }

    instance.render = (Component.render || NOOP) as InternalRenderFunction
  }
}
