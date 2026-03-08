import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';
import vertexShader from './shaders/vertex.glsl?raw';
import fragmentShader from './shaders/fragment.glsl?raw';
import type { SilkProps } from '../types';

export class SilkEngine {
  renderer: Renderer;
  gl: any;
  program: Program;
  mesh: Mesh;
  raf: number = 0;
  container: HTMLElement;
  private ro?: ResizeObserver;
  private t0: number = performance.now();
  private _isPaused: boolean = false;
  private pausedTime: number = 0;
  private pauseStartTime: number = 0;
  private config: SilkProps;

  get isPaused() {
    return this._isPaused;
  }

  constructor(container: HTMLElement, config: SilkProps) {
    this.container = container;
    this.config = config;

    this.renderer = new Renderer({ dpr: 2, alpha: true });
    this.gl = this.renderer.gl;
    this.container.appendChild(this.gl.canvas);

    const geometry = new Triangle(this.gl);

    const hexToRgb = (hex: string) => {
      const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
      const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
      const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
      return new Color(r, g, b);
    };

    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: hexToRgb(config.color || '#7B7481') },
        uSpeed: { value: config.speed ?? 1.0 },
        uScale: { value: config.scale ?? 1.0 },
        uRotation: { value: config.rotation ?? 0.0 },
        uNoiseIntensity: { value: config.noiseIntensity ?? 1.0 },
        uBrightness: { value: config.brightness ?? 1.0 },
        uChromaticAmount: { value: config.chromaticAmount ?? 0.02 },
        uSpecularIntensity: { value: config.specularIntensity ?? 0.25 },
        uSheen: { value: config.sheen ?? 0.6 },
        uResolution: { value: [0, 0] },
      },
    });

    this.mesh = new Mesh(this.gl, { geometry, program: this.program });

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.container);
    this.resize();

    this.loop(this.t0);
  }

  private loop = (time: number) => {
    this.raf = requestAnimationFrame(this.loop);

    if (this._isPaused) return;

    const rawSeconds = (time - this.t0 - this.pausedTime) * 0.001;
    this.program.uniforms.uTime.value = rawSeconds;
    this.renderer.render({ scene: this.mesh });
  };

  resize() {
    if (!this.container) return;
    const width = Math.max(1, Math.floor(this.container.offsetWidth));
    const height = Math.max(1, Math.floor(this.container.offsetHeight));
    this.renderer.setSize(width, height);
    this.program.uniforms.uResolution.value = [width, height];
  }

  updateConfig(config: SilkProps) {
    this.config = { ...this.config, ...config };
    const hexToRgb = (hex: string) => {
      const r = Number.parseInt(hex.slice(1, 3), 16) / 255;
      const g = Number.parseInt(hex.slice(3, 5), 16) / 255;
      const b = Number.parseInt(hex.slice(5, 7), 16) / 255;
      return new Color(r, g, b);
    };
    if (this.config.color) {
      this.program.uniforms.uColor.value = hexToRgb(this.config.color);
    }
    if (typeof this.config.speed === 'number')
      this.program.uniforms.uSpeed.value = this.config.speed;
    if (typeof this.config.scale === 'number')
      this.program.uniforms.uScale.value = this.config.scale;
    if (typeof this.config.rotation === 'number')
      this.program.uniforms.uRotation.value = this.config.rotation;
    if (typeof this.config.noiseIntensity === 'number')
      this.program.uniforms.uNoiseIntensity.value = this.config.noiseIntensity;
    if (typeof this.config.brightness === 'number')
      this.program.uniforms.uBrightness.value = this.config.brightness;
    if (typeof this.config.chromaticAmount === 'number')
      this.program.uniforms.uChromaticAmount.value = this.config.chromaticAmount;
    if (typeof this.config.specularIntensity === 'number')
      this.program.uniforms.uSpecularIntensity.value = this.config.specularIntensity;
    if (typeof this.config.sheen === 'number')
      this.program.uniforms.uSheen.value = this.config.sheen;
  }

  pause() {
    if (!this._isPaused) {
      this._isPaused = true;
      this.pauseStartTime = performance.now();
    }
  }

  resume() {
    if (this._isPaused) {
      this._isPaused = false;
      this.pausedTime += performance.now() - this.pauseStartTime;
    }
  }

  restart() {
    this.pausedTime = 0;
    this.pauseStartTime = 0;
    this.t0 = performance.now();
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.ro) this.ro.disconnect();
    if (this.container?.contains(this.gl.canvas))
      this.container.removeChild(this.gl.canvas);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}

export default SilkEngine;
