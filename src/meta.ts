import type { EffectMeta } from '@bg-effects/core';
import type { SilkProps } from './types';
import { generateRandomPalette, rand } from '@bg-effects/shared'

export const meta: EffectMeta<SilkProps> = {
  id: 'silk',
  name: { en: 'Silk', 'zh-CN': '丝绸' },
  category: 'art',
  version: '0.1.0',
  defaultConfig: {
    debug: false,
    lang: 'zh-CN',
    color: '#9B5FBF',
    speed: 1.0,
    scale: 1.0,
    rotation: 0.0,
    brightness: 1.0,
    noiseIntensity: 1.2,
    chromaticAmount: 0.0,
    specularIntensity: 0.25,
    sheen: 0.6,
  },
  randomize: (current, tab?) => {
    const result = { ...current }

    if (!tab) {
      const colors = generateRandomPalette(1)
      result.color = colors[0]
      result.speed = rand(0.6, 2.0)
      result.scale = rand(0.5, 2.0)
      result.rotation = rand(0, 360, 0)
      result.noiseIntensity = rand(0.5, 2.5)
      result.brightness = rand(0.6, 1.5)
      result.chromaticAmount = rand(0.0, 0.05)
      result.specularIntensity = rand(0.0, 0.6)
      result.sheen = rand(0.0, 1.0)
      return result
    }

    if (tab === 'basic') {
      result.speed = rand(0.6, 2.0)
      result.scale = rand(0.5, 2.0)
      result.noiseIntensity = rand(0.5, 2.5)
      result.brightness = rand(0.6, 1.5)
      return result
    }

    if (tab === 'colors') {
      const colors = generateRandomPalette(1)
      result.color = colors[0]
      return result
    }

    if (tab === 'visual') {
      result.rotation = rand(0, 360, 0)
      result.chromaticAmount = rand(0.0, 0.05)
      result.specularIntensity = rand(0.0, 0.6)
      result.sheen = rand(0.0, 1.0)
      return result
    }

    return result
  },
  presets: [
    {
      id: 'silk_midnight',
      name: { en: 'Midnight Aurora', 'zh-CN': '午夜极光' },
      config: {
        color: '#0f172a',
        speed: 0.6,
      },
    },
    {
      id: 'silk_sunset',
      name: { en: 'Desert Sunset', 'zh-CN': '沙漠晚霞' },
      config: {
        color: '#d4b82b',
        speed: 1.0,
      },
    },
    {
      id: 'silk_rose',
      name: { en: 'Rose Satin', 'zh-CN': '玫瑰绸缎' },
      config: {
        color: '#3b0d0d',
        speed: 0.9,
      },
    },
    {
      id: 'silk_emerald',
      name: { en: 'Emerald Flow', 'zh-CN': '翡翠流光' },
      config: {
        color: '#06281f',
        speed: 0.7,
      },
    },
  ],
};
