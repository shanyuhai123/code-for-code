/* eslint-disable prefer-const */

import type { ComponentInternalInstance } from './component'

export let currentRenderingInstance: ComponentInternalInstance | null = null
export let currentScopeId: string | null = null
