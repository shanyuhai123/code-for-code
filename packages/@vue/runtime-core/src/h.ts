export type VNode = {
  tag: string
  props: any
  children: any
  el?: Element
}

export function h (
  tag: string,
  props: any,
  children: any
): VNode {
  return {
    tag,
    props,
    children
  }
}
