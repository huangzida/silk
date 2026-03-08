# @bg-effects/silk

[English](./README.md) | [简体中文](./README_CN.md)

A high-performance silk background effect built with OGL and Vue.

[Live Demo](https://huangzida.github.io/silk/)

---

### Features

- 🚀 **High Performance**: Built with OGL (a lightweight WebGL library) for smooth rendering.
- 🎨 **Elegant Silk Effect**: Procedural silk-like animation with customizable noise and flow.
- 🛠️ **Debug Mode**: Built-in visual debug panel for real-time adjustments.
- 📦 **Ready to Use**: Easy-to-use Vue component with simple configuration.

### Installation

```bash
pnpm add @bg-effects/silk ogl
```

> **Note**: `ogl` is a peer dependency and needs to be installed manually.

### Usage

```vue
<script setup>
import { Silk } from '@bg-effects/silk'
</script>

<template>
  <div style="width: 100vw; height: 100vh; background: #000;">
    <Silk 
      :speed="1.2"
      color="#ffffff"
      :noise-intensity="0.8"
    />
  </div>
</template>
```

### Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `color` | `string` | `'#ffffff'` | Color of the silk |
| `speed` | `number` | `1.0` | Animation speed |
| `scale` | `number` | `1.0` | Effect scale |
| `rotation` | `number` | `0` | Rotation angle |
| `noiseIntensity` | `number` | `1.0` | Intensity of the noise flow |
| `brightness` | `number` | `1.0` | Overall brightness |
| `chromaticAmount` | `number` | `0.01` | Chromatic aberration amount |
| `specularIntensity` | `number` | `1.0` | Specular highlight intensity |
| `sheen` | `number` | `1.0` | Silk sheen intensity |
| `debug` | `boolean` | `false` | Enable debug panel |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | UI language |

### Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### License

MIT
