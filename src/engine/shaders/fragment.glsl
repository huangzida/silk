#version 300 es
precision highp float;

uniform float uTime;
uniform vec3 uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;
uniform float uBrightness;
uniform float uChromaticAmount;
uniform float uSpecularIntensity;
uniform float uSheen;
uniform vec2 uResolution;

in vec2 vUv;
out vec4 fragColor;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd = noise(gl_FragCoord.xy);
  // account for resolution aspect and center the rotation
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 centered = vUv - 0.5;
  centered.x *= aspect;
  centered *= uScale;
  vec2 uv = rotateUvs(centered, radians(uRotation));
  uv /= uScale;
  uv.x /= aspect;
  uv += 0.5;

  vec2  tex = uv * uScale;
  float tOffset = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                          sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  float chroma = uChromaticAmount;
  vec2 chromaOffset = vec2(chroma * 0.8, chroma * 0.4);
  vec2 texR = (uv + chromaOffset) * uScale;
  vec2 texB = (uv - chromaOffset) * uScale;
  texR.y += 0.03 * sin(8.0 * texR.x - tOffset);
  texB.y += 0.03 * sin(8.0 * texB.x - tOffset);
  float patternR = 0.6 +
                   0.4 * sin(5.0 * (texR.x + texR.y +
                                    cos(3.0 * texR.x + 5.0 * texR.y) +
                                    0.02 * tOffset) +
                           sin(20.0 * (texR.x + texR.y - 0.1 * tOffset)));
  float patternB = 0.6 +
                   0.4 * sin(5.0 * (texB.x + texB.y +
                                    cos(3.0 * texB.x + 5.0 * texB.y) +
                                    0.02 * tOffset) +
                           sin(20.0 * (texB.x + texB.y - 0.1 * tOffset)));

  vec3 base = vec3(patternR, pattern, patternB);
  vec4 col = vec4(uColor * base, 1.0) - rnd / 15.0 * uNoiseIntensity;
  float spec = pow(max(pattern - 0.55, 0.0), 2.5);
  col.rgb += spec * uSpecularIntensity;
  float sheenMask = pow(1.0 - abs(uv.y - 0.5) * 2.0, 2.5);
  col.rgb += sheenMask * uSheen * 0.25;
  // apply brightness
  col.rgb *= uBrightness;
  col.a = 1.0;
  fragColor = col;
}
