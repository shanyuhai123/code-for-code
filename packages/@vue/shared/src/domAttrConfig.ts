import { makeMap } from './makeMap'

const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`
export const isSpecialBooleanAttr: (key: string) => boolean = makeMap(specialBooleanAttrs)

export const isBooleanAttr: (key: string) => boolean = makeMap(
  `${specialBooleanAttrs},disabled`,
)

export function includeBooleanAttr(value: unknown): boolean {
  return !!value || value === ''
}
