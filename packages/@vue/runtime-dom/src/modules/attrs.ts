import { includeBooleanAttr, isSpecialBooleanAttr } from '@vue/shared'

export function patchAttr(
  el: Element,
  key: string,
  value: any,
  isBoolean: boolean = isSpecialBooleanAttr(key),
) {
  if (value === null || (isBoolean && !includeBooleanAttr(value))) {
    el.removeAttribute(key)
  }
  else {
    el.setAttribute(key, value)
  }
}
