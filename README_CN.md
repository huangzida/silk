# @bg-effects/silk

[English](./README.md) | [简体中文](./README_CN.md)

基于 OGL 和 Vue 构建的高性能丝绸背景特效。

[在线演示](https://huangzida.github.io/silk/)

---

### 特性

- 🚀 **高性能**: 基于 OGL (轻量级 WebGL 库) 构建，运行流畅。
- 🎨 **优雅丝绸特效**: 具有可定制噪声和流动的程序化丝绸动画。
- 🛠️ **调试模式**: 内置可视化调试面板，方便实时调整效果。
- 📦 **开箱即用**: 作为 Vue 组件，简单配置即可使用。

### 安装

```bash
pnpm add @bg-effects/silk ogl
```

> **注意**: `ogl` 是 peer dependency，需要手动安装。

### 使用

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

### 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `color` | `string` | `'#ffffff'` | 丝绸颜色 |
| `speed` | `number` | `1.0` | 动画速度 |
| `scale` | `number` | `1.0` | 效果缩放 |
| `rotation` | `number` | `0` | 旋转角度 |
| `noiseIntensity` | `number` | `1.0` | 噪声流动强度 |
| `brightness` | `number` | `1.0` | 整体亮度 |
| `chromaticAmount` | `number` | `0.01` | 色散强度 |
| `specularIntensity` | `number` | `1.0` | 高光强度 |
| `sheen` | `number` | `1.0` | 丝绸光泽强度 |
| `debug` | `boolean` | `false` | 是否开启调试面板 |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | 界面语言 |

### 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发环境
pnpm dev
```

### 许可

MIT
