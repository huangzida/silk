import Silk from './Silk.vue'
import { meta } from './meta'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'

export { Silk, meta }
export type { SilkProps } from './types'

export const locales = {
	en,
	'zh-CN': zhCN
}
