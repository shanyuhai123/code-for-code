import { no } from 'vue/shared/util'

type Config = {
  optionMergeStrategies: {
    [key: string]: Function
  }
  keyCodes: { [key: string]: number | Array<number> }

  // platform
  isReservedTag: (x: string) => boolean
  isReservedAttr: (x: string) => boolean
}

const config: Config = {
  optionMergeStrategies: Object.create(null),
  keyCodes: Object.create(null),
  isReservedTag: no,
  isReservedAttr: no
}

export default config
