/** Shaders for the painted Maine sunrise on the home hero. */

export const HERO_VERTEX = `
attribute vec2 p;
varying vec2 vUv;
void main() {
  vUv = vec2(p.x * .5 + .5, .5 - p.y * .5);
  gl_Position = vec4(p, 0., 1.);
}
`;

export const HERO_FRAGMENT = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImg, uMap;          // painting · depth map (r depth, g sea, b sky)
uniform vec2  uRes, uPtr, uSun;
uniform float uTime, uNight, uAspect, uHz, uScroll;
uniform float uScaleY, uBiasY;         // canvas → image mapping (extra sky or crop to the path)
uniform vec3  uPaper;
const float R = .053;                  // sun radius in aspect-corrected uv

float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
vec3 screen(vec3 a, vec3 b) { return 1. - (1. - a) * (1. - b); }

void main() {
  vec2 uv = vec2(vUv.x, vUv.y * uScaleY + uBiasY);   // image space; y < 0 is extra sky

  // 1. depth parallax: two-step lookup so near pines slide over the far sea without tearing
  vec2 amp = vec2(.022, .012);
  vec2 dir = uPtr + vec2(0., uScroll * 1.4);
  float d = texture2D(uMap, uv).r;
  vec2 off = dir * (d - .3) * amp;
  d = texture2D(uMap, uv + off).r;
  off = dir * (d - .3) * amp;
  vec2 suv = .5 + (uv + off - .5) * .968;            // slight overscan hides the edges

  vec3 m = texture2D(uMap, suv).rgb;
  float sea = m.g, sky = m.b;

  // 2. sea ripple, stronger toward the shore
  float t = uTime;
  float rip = sin(suv.y * 520. + t * 1.7) * .0011 + sin(suv.y * 300. - t * 1.2 + suv.x * 38.) * .0008;
  suv.x += rip * sea * (.6 + .8 * smoothstep(uHz, uHz + .05, suv.y));
  vec3 col = texture2D(uImg, suv).rgb;

  vec2 q = (uv - uSun) * vec2(uAspect, 1.);
  float dist = length(q);

  // 3. sun glitter on the reflection column
  float column = exp(-pow((suv.x - uSun.x) / .045, 2.));
  float gl = pow(noise(vec2(suv.x * 260., suv.y * 1400. - t * 2.2)), 9.) * sea * column;
  col += gl * vec3(1., .86, .55) * 1.6;

  // 4. breathing glow + slow god rays — sky only, masked off the sun disc
  float above = smoothstep(uHz + .004, uHz - .01, uv.y);
  float halo = smoothstep(R - .002, R + .014, dist);  // 0 on the disc, 1 outside
  float glow = exp(-dist * dist * 55.) * (.20 + .06 * sin(t * .7)) * halo;
  float a = atan(q.y, q.x);
  float r = .5 + .5 * sin(a * 13. + sin(a * 4. + t * .18) * 2.3 + t * .12);
  r *= .55 + .45 * sin(a * 29. - t * .09);
  float rays = pow(r, 2.2) * exp(-dist * 4.2) * sky * above * .20 * halo;
  col = screen(col, vec3(1., .74, .36) * (glow * (.35 + .65 * sky) + rays));

  // 5. dusk grade (dark mode): deep sky, cooled land, ember sun clipped at the horizon, stars
  if (uNight > .001) {
    vec3 skyN = mix(uPaper, vec3(.20, .23, .30), smoothstep(.12, uHz, uv.y));
    vec3 landN = col * vec3(.30, .37, .46);
    vec3 n = mix(landN, skyN, sky * above);
    float disc = smoothstep(R + .0015, R - .0015, dist) * above;
    n = mix(n, col * vec3(1., .62, .38), disc);
    n = screen(n, vec3(.95, .45, .2) * exp(-dist * dist * 30.) * .42 * (1. - disc) * (.25 + .75 * sky * above));
    n += gl * vec3(1., .6, .35) * 1.2;
    vec2 cell = floor(uv * vec2(70., 122.));
    float h = hash(cell);
    float st = step(.99, h) * smoothstep(.3, .0, length(fract(uv * vec2(70., 122.)) - .5)) * (.55 + .45 * sin(t * 1.6 + h * 60.));
    n += st * sky * above * smoothstep(uHz, .2, uv.y) * vec3(1., .95, .85) * .9;
    col = mix(col, n, uNight);
  }

  // 6. dissolve the top of the sky into the page colour
  col = mix(uPaper, col, smoothstep(.02, .17, uv.y));

  // 7. risograph grain, stepped at 12fps like print texture
  float g = hash(uv * uRes + floor(t * 12.) * 17.) - .5;
  col += g * .03;
  gl_FragColor = vec4(col, 1.);
}
`;

/** Painting geometry (normalised to the source image). */
export const HERO_IMAGE = {
  src: "/art/maine-sunrise.jpg",
  depth: "/art/maine-sunrise-depth.png",
  width: 1024,
  height: 1796,
  sun: [550 / 1024, (723 + 260) / 1796] as const,
  horizon: (752 + 260) / 1796,
};

export const PAPER_RGB = {
  light: [251 / 255, 246 / 255, 238 / 255],
  dark: [20 / 255, 27 / 255, 29 / 255],
};
