<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, defineAsyncComponent, computed } from 'vue'
import { DebugShell } from '@bg-effects/debug-ui'
import { defu } from 'defu'
import { meta } from './meta'
import type { SilkProps } from './types'
import SilkEngine from './engine'

// 遵循 polygons 的工程化模板风格
const props = defineProps<SilkProps & { debug?: boolean, lang?: 'zh-CN' | 'en' }>()
// const emit = defineEmits([])

const ConfigContent = defineAsyncComponent(() => import('./ui/ConfigPanel.vue'))
const configContentRef = ref<any>(null)

const handleUpdateConfig = (newConfig: SilkProps) => {
  config.value = newConfig
}

const resolveInitialConfig = () => {
  return defu(props, meta.defaultConfig) as SilkProps
}

const config = ref<SilkProps>(resolveInitialConfig())
const internalLang = ref<'zh-CN' | 'en'>(config.value.lang as any)

watch(() => props, (newProps) => {
  if (!props.debug) {
    config.value = defu(newProps, meta.defaultConfig) as SilkProps
  }
}, { deep: true })

const handleRandomize = () => {
  if (meta.randomize) {
    const currentTab = configContentRef.value?.activeTab as any
    const tabValue = typeof currentTab === 'object' && currentTab?.value ? currentTab.value : currentTab
    const randomized = meta.randomize(config.value, tabValue)
    config.value = {
      ...randomized,
      debug: config.value.debug,
      lang: config.value.lang
    }
  }
}

const effectiveConfig = computed(() => props.debug ? config.value : props)

const containerRef = ref<HTMLElement | null>(null)
let engine: SilkEngine | null = null

// 过渡与重建支持
const isTransitioning = ref(false)
const canvasOpacity = ref(1)

const engineInterface = computed(() => ({
  pause: () => engine?.pause(),
  resume: () => engine?.resume(),
  restart: () => engine?.restart(),
}))

// 当颜色数量发生变化时需要重建（示例），记录上一次颜色长度
const lastColorsLen = ref<number | undefined>(config.value.color?.length)

watch(effectiveConfig, (newCfg) => {
  if (!engine || !containerRef.value) return

  const needsRecreate = (newCfg.color?.length ?? 0) !== (lastColorsLen.value ?? 0)

  if (needsRecreate) {
    isTransitioning.value = true
    canvasOpacity.value = 0
    setTimeout(() => {
      const wasPaused = engine?.isPaused
      engine?.destroy()
      engine = new SilkEngine(containerRef.value!, newCfg as SilkProps)
      if (wasPaused) engine?.pause()
      lastColorsLen.value = newCfg.color?.length
      setTimeout(() => {
        canvasOpacity.value = 1
        isTransitioning.value = false
      }, 50)
    }, 300)
  } else {
    engine.updateConfig(newCfg as SilkProps)
  }
}, { deep: true })

onMounted(() => {
  if (!containerRef.value) return
  engine = new SilkEngine(containerRef.value, effectiveConfig.value as SilkProps)
  lastColorsLen.value = effectiveConfig.value.color?.length

  const canvas = containerRef.value.querySelector('canvas')
  if (canvas) {
    canvas.style.transition = 'opacity 0.3s ease-in-out'
    watch(canvasOpacity, (opacity) => {
      canvas.style.opacity = opacity.toString()
    })
  }
})

onUnmounted(() => {
  engine?.destroy()
  engine = null
})
</script>

<template>
  <div ref="containerRef" :class="['relative w-full h-full overflow-hidden', className]">
    <DebugShell
      v-if="effectiveConfig && effectiveConfig.debug"
      v-model:config="config"
      v-model:lang="internalLang"
      :meta="meta"
      :engine="engineInterface"
      @randomize="handleRandomize"
    >
      <template #settings>
        <ConfigContent ref="configContentRef" :config="config" :lang="internalLang" @update:config="handleUpdateConfig" />
      </template>
    </DebugShell>
  </div>
</template>

<style scoped>
</style>
