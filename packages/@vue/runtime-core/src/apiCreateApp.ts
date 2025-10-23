import type { ComponentCustomProperties } from './componentPublicInstance'
import { NO } from '@vue/shared'

export interface App {
  version: string
  config: AppConfig
}

export interface AppConfig {
  // @private
  readonly isNativeTag: (tag: string) => boolean
  performance: boolean
  globalProperties: ComponentCustomProperties & Record<string, any>
}

export interface AppContext {
  app: App
  config: AppConfig
}

export function createAppContext(): AppContext {
  return {
    app: null as any,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
    },
  }
}
