import { markRaw } from '@vue/reactivity'

export enum TestNodeTypes {
  TEXT = 'text',
  ELEMENT = 'element',
  COMMENT = 'comment',
}

export enum NodeOpTypes {
  CREATE = 'create',
  INSERT = 'insert',
  REMOVE = 'remove',
  SET_TEXT = 'setText',
  SET_ELEMENT_TEXT = 'setElementText',
  PATCH = 'patch',
}

export interface TestElement {
  id: number
  type: TestNodeTypes.ELEMENT
  parentNode: TestElement | null
  tag: string
  children: TestNode[]
  props: Record<string, any>
  eventListeners: Record<string, Function | Function[]> | null
}

export interface TestText {
  id: number
  type: TestNodeTypes.TEXT
  parentNode: TestElement | null
  text: string
}

export interface TestComment {
  id: number
  type: TestNodeTypes.COMMENT
  parentNode: TestElement | null
  text: string
}

export type TestNode = TestElement | TestText | TestComment

export interface NodeOp {

}

let nodeId: number = 0
let recordedNodeOps: NodeOp[] = []

export function logNodeOp(op: NodeOp): void {
  recordedNodeOps.push(op)
}

export function resetOps(): void {
  recordedNodeOps = []
}

export function dumpOps(): NodeOp[] {
  const ops = recordedNodeOps.slice()
  resetOps()
  return ops
}

function createElement(tag: string): TestElement {
  const node: TestElement = {
    id: nodeId++,
    type: TestNodeTypes.ELEMENT,
    tag,
    children: [],
    props: {},
    parentNode: null,
    eventListeners: null,
  }
  logNodeOp({
    type: NodeOpTypes.CREATE,
    nodeType: TestNodeTypes.ELEMENT,
    targetNode: node,
    tag,
  })

  markRaw(node)

  return node
}

export const nodeOps: {
  createElement: typeof createElement
} = {
  createElement,
}
