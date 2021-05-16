import { isBuiltInTag } from 'vue/shared/util'
import { unicodeRegExp } from '.'
import Vue from '..'
import { ComponentOptions } from '../types/options'

export const checkComponents = (options: ComponentOptions) => {
  for (const key in options.components) {
    validateComponentName(key)
  }
}

export const validateComponentName = (name: string) => {
  if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
    throw new Error(`Invalid component name: ${name}.`)
  }
  if (isBuiltInTag(name)) {
    throw new Error(`Do not use built-in or reserved HTML elements as component id: ${name}`)
  }
}

export const mergeOptions = (parent: Object, child: ComponentOptions, vm: Vue): Object => {
  checkComponents(child)

  const options: {
    [key: string]: any
  } = {}

  // parent will get Vue.options, ignored
  for (const key in child) {
    mergeField(key)
  }

  function mergeField (key: string) {
    options[key] = child[key]
  }

  return options
}
