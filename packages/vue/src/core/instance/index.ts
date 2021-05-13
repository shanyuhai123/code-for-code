import { ComponentOptions } from '@/types/options'

let uid = 0
class Vue {
  uid: number = 0

  constructor (options?: ComponentOptions) {
    this.init(options)
  }

  private init (options?: ComponentOptions) {
    this.uid = uid++
  }
}

export default Vue
