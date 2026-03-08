<script setup lang="ts">
import { ref, computed } from 'vue';
import { SubTabs } from '@bg-effects/shared';
import type { SilkProps } from '../types';
import zhCN from '../locales/zh-CN.json';
import en from '../locales/en.json';

const props = defineProps<{
  config: SilkProps;
  lang?: 'zh-CN' | 'en';
}>();

const emit = defineEmits<{
  (e: 'update:config', value: SilkProps): void;
}>();

const activeTab = ref<'basic' | 'colors' | 'visual'>('basic');

defineExpose({ activeTab });

const i18n = {
  'zh-CN': zhCN,
  en,
};

const t = (path: string) => {
  const dict = (i18n as any)[props.lang || 'zh-CN'];
  return path.split('.').reduce((o: any, k: string) => o?.[k], dict) || path;
};

const subTabs = computed(() => [
  { id: 'basic', label: t('subtabs.basic') },
  { id: 'colors', label: t('subtabs.colors') },
  { id: 'visual', label: t('subtabs.visual') },
]);

const updateConfig = (key: keyof SilkProps, value: any) => {
  emit('update:config', {
    ...props.config,
    [key]: value,
  });
};
</script>

<template>
  <div class="flex flex-col gap-6 text-white/90">
    <SubTabs v-model="activeTab" :tabs="subTabs" />

    <div class="flex flex-col gap-6 p-1 pointer-events-auto overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
      <div v-if="activeTab === 'basic'" class="flex flex-col gap-6">
        <div v-for="prop in [
          {id: 'speed', min:0, max:3, step:0.1, label: 'speed'},
          {id: 'scale', min:0.1, max:3, step:0.1, label: 'scale'},
          {id: 'noiseIntensity', min:0, max:5, step:0.1, label: 'noise'},
          {id: 'brightness', min:0, max:2, step:0.1, label: 'brightness'}
        ]" :key="prop.id" class="flex flex-col gap-3 group/item">
          <div class="flex justify-between items-center px-1">
            <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover/item:text-white/40 transition-colors">{{ t(`labels.${prop.label}`) }}</label>
            <span class="text-[11px] font-black font-mono text-white/40 group-hover/item:text-blue-400 transition-colors">
              {{ typeof props.config[prop.id as keyof SilkProps] === 'number' ? (props.config[prop.id as keyof SilkProps] as number).toFixed(prop.step < 0.1 ? 2 : 1) : props.config[prop.id as keyof SilkProps] }}
            </span>
          </div>
          <input 
            :value="props.config[prop.id as keyof SilkProps]" 
            type="range" 
            :min="prop.min" 
            :max="prop.max" 
            :step="prop.step" 
            class="w-full accent-blue-500 bg-white/5 hover:bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer transition-all border border-white/5"
            @input="(e: any) => updateConfig(prop.id as keyof SilkProps, Number(e.target.value))"
          >
        </div>
      </div>

      <div v-if="activeTab === 'colors'" class="flex flex-col gap-6">
        <div class="flex flex-col gap-3 group/item">
          <div class="flex justify-between items-center px-1">
            <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover/item:text-white/40 transition-colors">{{ t('labels.colors') }}</label>
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded border border-white/20" :style="{ background: props.config.color }" />
              <span class="text-[11px] font-black font-mono text-white/40 group-hover/item:text-blue-400 transition-colors">{{ props.config.color }}</span>
            </div>
          </div>
          <input 
            :value="props.config.color" 
            type="color" 
            class="w-full h-10 rounded cursor-pointer bg-white/5 border border-white/10"
            @input="(e: any) => updateConfig('color', e.target.value)"
          >
        </div>
      </div>

      <div v-if="activeTab === 'visual'" class="flex flex-col gap-6">
        <div v-for="prop in [
          {id: 'chromaticAmount', min:0, max:0.1, step:0.001, label: 'chromatic'},
          {id: 'specularIntensity', min:0, max:1, step:0.01, label: 'specular'},
          {id: 'sheen', min:0, max:1, step:0.01, label: 'sheen'},
          {id: 'rotation', min:0, max:360, step:1, label: 'rotation'}
        ]" :key="prop.id" class="flex flex-col gap-3 group/item">
          <div class="flex justify-between items-center px-1">
            <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover/item:text-white/40 transition-colors">{{ t(`labels.${prop.label}`) }}</label>
            <span class="text-[11px] font-black font-mono text-white/40 group-hover/item:text-blue-400 transition-colors">
              {{ typeof props.config[prop.id as keyof SilkProps] === 'number' ? (props.config[prop.id as keyof SilkProps] as number).toFixed(prop.step < 0.1 ? 2 : 0) : props.config[prop.id as keyof SilkProps] }}
            </span>
          </div>
          <input 
            :value="props.config[prop.id as keyof SilkProps]" 
            type="range" 
            :min="prop.min" 
            :max="prop.max" 
            :step="prop.step" 
            class="w-full accent-blue-500 bg-white/5 hover:bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer transition-all border border-white/5"
            @input="(e: any) => updateConfig(prop.id as keyof SilkProps, Number(e.target.value))"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
