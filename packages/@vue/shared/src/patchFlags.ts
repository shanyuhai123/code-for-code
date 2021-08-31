export const enum PatchFlags {
  /**
   * 表示具有动态 textContent 的元素
   */
  TEXT = 1,

  /**
   * 表示具有动态 class 的元素
   */
  CLASS = 1 << 1,

  /**
   * 表示具有头动态 style 的元素
   */
  STYLE = 1 << 2,

  /**
   * 表示具有动态 props 的元素
   */
  PROPS = 1 << 3,

  /**
   * 表示具有动态属性的元素
   * 非 CLASS、STYLE、PROPS
   */
  FULL_PROPS = 1 << 4,

  /**
   * 表示具有事件监听器的元素
   */
  HYDRATE_EVENTS = 1 << 5,

  /**
   * 表示子元素顺序不会变更的 fragment
   */
  STABLE_FRAGMENT = 1 << 6,

  /**
   * 表示子元素（部分）含有 key 的 fragment
   */
  KEYED_FRAGMENT = 1 << 7,

  /**
   * 表示子元素不含有 key 的 fragment
   */
  UNKEYED_FRAGMENT = 1 << 8,

  /**
   * 表示只需要非属性比较的元素，例如 ref、directives
   */
  NEED_PATCH = 1 << 9,

  /**
   * 表示具有动态插槽的元素
   */
  DYNAMIC_SLOTS = 1 << 10,

  /**
   * 表示模板注释的 fragment（仅开发中显示）。
   */
  DEV_ROOT_FRAGMENT = 1 << 11,

  /**
   * 特殊 FLAGS
   * 负数 FLAG 不参与 diff
   */

  /**
   * 表示静态节点
   */
  HOISTED = -1,

  /**
   * 针对 renderSlot
   */
  BAIL = -2
}

export const PatchFlagNames = {
  [PatchFlags.TEXT]: 'TEXT',
  [PatchFlags.CLASS]: 'CLASS',
  [PatchFlags.STYLE]: 'STYLE',
  [PatchFlags.PROPS]: 'PROPS',
  [PatchFlags.FULL_PROPS]: 'FULL_PROPS',
  [PatchFlags.HYDRATE_EVENTS]: 'HYDRATE_EVENTS',
  [PatchFlags.STABLE_FRAGMENT]: 'STABLE_FRAGMENT',
  [PatchFlags.KEYED_FRAGMENT]: 'KEYED_FRAGMENT',
  [PatchFlags.UNKEYED_FRAGMENT]: 'UNKEYED_FRAGMENT',
  [PatchFlags.NEED_PATCH]: 'NEED_PATCH',
  [PatchFlags.DYNAMIC_SLOTS]: 'DYNAMIC_SLOTS',
  [PatchFlags.DEV_ROOT_FRAGMENT]: 'DEV_ROOT_FRAGMENT',
  [PatchFlags.HOISTED]: 'HOISTED',
  [PatchFlags.BAIL]: 'BAIL'
}
