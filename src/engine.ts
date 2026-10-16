import * as THREE from 'three';

/**
 * A single particle system that lives behind the whole page.
 * Formation 0 is a live order book: bids (left) and asks (right) flow toward
 * the mid price and "fill" in a burst of signal color. Scrolling morphs the
 * same particles through the formations below, one per page section.
 *
 *   0 order book   1 ring   2 helix   3 lattice   4 layer stack   5 core   6 closed spread
 */
export const FORMATION_COUNT = 7;

export interface Engine {
  /** Continuous section index in [0, FORMATION_COUNT - 1]. */
  setProgress(p: number): void;
  /** Pointer in normalized device coordinates (-1..1). */
  setPointer(x: number, y: number): void;
  /** Re-read colors from CSS custom properties. */
  refreshTheme(): void;
  onFill(cb: (side: 0 | 1) => void): void;
}

interface Layout {
  x: number;
  y: number;
  s: number;
}

// Where each formation sits on screen, per breakpoint. On desktop `x` is a
// fraction of the visible half-width and `s` is scaled to fit narrower windows.
const DESKTOP: Layout[] = [
  { x: 0.5, y: -0.7, s: 0.5 },
  { x: 0.5, y: 0, s: 0.95 },
  { x: 0.5, y: 0, s: 0.9 },
  { x: 0.52, y: 0, s: 0.9 },
  { x: 0.5, y: 0.1, s: 0.9 },
  { x: 0.5, y: 0, s: 0.95 },
  { x: 0, y: -2.9, s: 1 },
];
const MOBILE: Layout[] = [
  { x: 0, y: -2.6, s: 0.42 },
  { x: 0, y: 1.6, s: 0.62 },
  { x: 0, y: 1.6, s: 0.5 },
  { x: 0, y: 1.8, s: 0.55 },
  { x: 0, y: 1.6, s: 0.55 },
  { x: 0, y: 1.6, s: 0.6 },
  { x: 0, y: -2.9, s: 0.5 },
];

// Per-formation idle rotation (rad/s around Y) and fixed tilt (around X).
const SPIN = [0, 0.12, 0.25, 0.07, 0.09, 0.14, 0];
const TILT = [0, 1.15, 0.12, 0.45, 0.5, 0.3, 0];

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

function buildFormations(count: number, rand: () => number): Float32Array[] {
  const out: Float32Array[] = [];
  for (let f = 0; f < FORMATION_COUNT; f++) out.push(new Float32Array(count * 3));

  // 1 — engine ring (torus volume)
  const ring = out[1];
  for (let i = 0; i < count; i++) {
    const a = rand() * Math.PI * 2;
    const b = rand() * Math.PI * 2;
    const r = 0.75 * Math.sqrt(rand());
    const R = 3 + r * Math.cos(b);
    ring[i * 3] = R * Math.cos(a);
    ring[i * 3 + 1] = r * Math.sin(b);
    ring[i * 3 + 2] = R * Math.sin(a);
  }

  // 2 — helix: two strands climbing through time, joined by rungs
  const helix = out[2];
  for (let i = 0; i < count; i++) {
    const t = rand();
    const a = t * Math.PI * 2 * 2.5;
    const y = (t - 0.5) * 6.4;
    if (rand() < 0.16) {
      // rung between the strands at a quantized height
      const tq = Math.floor(t * 22) / 22;
      const aq = tq * Math.PI * 2 * 2.5;
      const k = rand() * 2 - 1;
      helix.set([Math.cos(aq) * 1.9 * k, (tq - 0.5) * 6.4, Math.sin(aq) * 1.9 * k], i * 3);
    } else {
      const strand = rand() < 0.5 ? 0 : Math.PI;
      const j = () => (rand() - 0.5) * 0.18;
      helix.set([Math.cos(a + strand) * 1.9 + j(), y + j(), Math.sin(a + strand) * 1.9 + j()], i * 3);
    }
  }

  // 3 — lattice: particles strung along the edges of a 4×4×4 voxel grid
  const lat = out[3];
  const div = 4;
  const size = 4.4;
  for (let i = 0; i < count; i++) {
    const axis = Math.floor(rand() * 3);
    const u = (Math.floor(rand() * (div + 1)) / div - 0.5) * size;
    const v = (Math.floor(rand() * (div + 1)) / div - 0.5) * size;
    const t = (rand() - 0.5) * size;
    const p = axis === 0 ? [t, u, v] : axis === 1 ? [u, t, v] : [u, v, t];
    lat.set(p, i * 3);
  }

  // 4 — layer stack: four planes (protocol → application) plus a few risers
  const stack = out[4];
  const levels = [-2.1, -0.7, 0.7, 2.1];
  for (let i = 0; i < count; i++) {
    if (rand() < 0.08) {
      const cx = (Math.floor(rand() * 3) - 1) * 1.6;
      const cz = (Math.floor(rand() * 3) - 1) * 1.6;
      stack.set([cx, (rand() - 0.5) * 4.2, cz], i * 3);
    } else {
      const g = 26;
      const x = (Math.floor(rand() * g) / (g - 1) - 0.5) * 4.2;
      const z = (Math.floor(rand() * g) / (g - 1) - 0.5) * 4.2;
      const y = levels[Math.floor(rand() * 4)] + (rand() - 0.5) * 0.05;
      stack.set([x, y, z], i * 3);
    }
  }

  // 5 — core: fibonacci sphere shell
  const core = out[5];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const rad = 2.6 + (rand() - 0.5) * 0.12;
    core.set([Math.cos(th) * r * rad, y * rad, Math.sin(th) * r * rad], i * 3);
  }

  // 6 — closed spread: everything collapses onto one line, densest at the mid
  const line = out[6];
  for (let i = 0; i < count; i++) {
    const s = rand() < 0.5 ? -1 : 1;
    const x = s * Math.pow(rand(), 1.8) * 7.5;
    const spread = 0.02 + 0.06 * (Math.abs(x) / 7.5);
    line.set([x, (rand() - 0.5) * spread * 2, (rand() - 0.5) * 0.6], i * 3);
  }

  return out;
}

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aHeat;
  attribute float aAlpha;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vHeat;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * aSize * (1.0 + aHeat * 1.6) * uPixelRatio * (14.0 / -mv.z);
    vHeat = aHeat;
    vAlpha = aAlpha;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uSignal;
  uniform float uOpacity;
  varying float vHeat;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float edge = smoothstep(0.5, 0.32, d);
    vec3 col = mix(uInk, uSignal, clamp(vHeat * 1.4, 0.0, 1.0));
    float a = edge * vAlpha * mix(uOpacity, 1.0, vHeat);
    gl_FragColor = vec4(col, a);
  }
`;

export function createEngine(canvas: HTMLCanvasElement, reducedMotion: boolean): Engine {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  renderer.setPixelRatio(pixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  const isSmall = () => window.innerWidth < 820;
  const COUNT = isSmall() ? 6000 : 11000;
  const rand = mulberry32(2017);
  const formations = buildFormations(COUNT, rand);

  // Order-book state per particle.
  const side = new Uint8Array(COUNT);
  const depthU = new Float32Array(COUNT); // distance from mid price, 0..1
  const speed = new Float32Array(COUNT);
  const ry = new Float32Array(COUNT);
  const rz = new Float32Array(COUNT);
  const heat = new Float32Array(COUNT);
  const burst = new Float32Array(COUNT * 3);
  const delay = new Float32Array(COUNT);
  const accent = new Float32Array(COUNT);
  const phase = new Float32Array(COUNT);

  const positions = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);
  const heatAttr = new Float32Array(COUNT);
  const alphaAttr = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    side[i] = i & 1;
    depthU[i] = rand();
    speed[i] = 0.012 + rand() * 0.035;
    ry[i] = rand();
    rz[i] = rand() * 2 - 1;
    delay[i] = rand();
    accent[i] = rand() < 0.03 ? 1 : 0;
    phase[i] = rand() * Math.PI * 2;
    sizes[i] = 0.6 + rand() * 0.9;
  }

  const geometry = new THREE.BufferGeometry();
  const posAttribute = new THREE.BufferAttribute(positions, 3);
  const heatAttribute = new THREE.BufferAttribute(heatAttr, 1);
  const alphaAttribute = new THREE.BufferAttribute(alphaAttr, 1);
  posAttribute.setUsage(THREE.DynamicDrawUsage);
  heatAttribute.setUsage(THREE.DynamicDrawUsage);
  alphaAttribute.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', posAttribute);
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aHeat', heatAttribute);
  geometry.setAttribute('aAlpha', alphaAttribute);
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50);

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uSize: { value: 2.4 },
      uPixelRatio: { value: pixelRatio },
      uInk: { value: new THREE.Color() },
      uSignal: { value: new THREE.Color() },
      uOpacity: { value: 0.6 },
    },
  });
  scene.add(new THREE.Points(geometry, material));

  let baseOpacity = 0.6;
  let progress = 0;
  let progressTarget = 0;
  const pointer = { x: 0, y: 0 };
  const fillListeners: ((side: 0 | 1) => void)[] = [];

  function refreshTheme() {
    const css = getComputedStyle(document.documentElement);
    material.uniforms.uInk.value.set(css.getPropertyValue('--particle').trim() || '#141412');
    material.uniforms.uSignal.value.set(css.getPropertyValue('--signal').trim() || '#ff4a1c');
    baseOpacity = parseFloat(css.getPropertyValue('--particle-opacity')) || 0.6;
  }
  refreshTheme();

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Scratch: transformed position of particle i in formation f.
  const tmp = new Float32Array(3);
  const rot = new Float32Array(FORMATION_COUNT * 4); // cosY, sinY, cosX, sinX

  function orderBookPosition(i: number) {
    const sgn = side[i] ? 1 : -1;
    if (heat[i] > 0) {
      // Filled: burst outward from the mid price.
      const k = 1 - heat[i];
      const e = 1 - (1 - k) * (1 - k);
      tmp[0] = sgn * 0.12 + burst[i * 3] * e;
      tmp[1] = -1.8 + ry[i] * 0.5 + burst[i * 3 + 1] * e;
      tmp[2] = rz[i] * 1.4 + burst[i * 3 + 2] * e;
      return;
    }
    const u = depthU[i];
    const step = Math.floor(u * 18) / 18;
    const depth = 0.25 + 3.9 * Math.pow(step, 1.3);
    tmp[0] = sgn * (0.12 + u * 6);
    tmp[1] = -1.8 + ry[i] * depth;
    tmp[2] = rz[i] * 1.4;
  }

  function formationPosition(f: number, i: number, layout: Layout) {
    if (f === 0) {
      orderBookPosition(i);
    } else {
      const src = formations[f];
      tmp[0] = src[i * 3];
      tmp[1] = src[i * 3 + 1];
      tmp[2] = src[i * 3 + 2];
    }
    const cy = rot[f * 4];
    const sy = rot[f * 4 + 1];
    const cx = rot[f * 4 + 2];
    const sx = rot[f * 4 + 3];
    // rotate Y, then X
    const x1 = tmp[0] * cy + tmp[2] * sy;
    const z1 = -tmp[0] * sy + tmp[2] * cy;
    const y2 = tmp[1] * cx - z1 * sx;
    const z2 = tmp[1] * sx + z1 * cx;
    tmp[0] = x1 * layout.s + layout.x;
    tmp[1] = y2 * layout.s + layout.y;
    tmp[2] = z2 * layout.s;
  }

  // Half the visible width of the z = 0 plane.
  const halfWidth = () => Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z * camera.aspect;

  function layoutFor(f: number): Layout {
    if (isSmall()) return MOBILE[f];
    const hw = halfWidth();
    const fit = Math.min(1, hw / 7.85);
    const l = DESKTOP[f];
    return { x: l.x * hw, y: l.y, s: l.s * fit };
  }

  const clock = new THREE.Clock();
  let elapsed = 0;

  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const motion = reducedMotion ? 0 : 1;
    elapsed += dt * motion;

    progress += (progressTarget - progress) * (reducedMotion ? 1 : Math.min(1, dt * 4));

    // Advance the order book.
    if (motion) {
      for (let i = 0; i < COUNT; i++) {
        if (heat[i] > 0) {
          heat[i] -= dt * 1.3;
          if (heat[i] <= 0) {
            heat[i] = 0;
            depthU[i] = 1 + rand() * 0.04;
            ry[i] = rand();
          }
          continue;
        }
        depthU[i] -= speed[i] * dt;
        if (depthU[i] <= 0) {
          heat[i] = 1;
          const a = rand() * Math.PI * 2;
          const m = 0.4 + rand() * 1.4;
          burst[i * 3] = Math.cos(a) * m * 0.7;
          burst[i * 3 + 1] = Math.abs(Math.sin(a)) * m * 1.6 + 0.2;
          burst[i * 3 + 2] = (rand() - 0.5) * m;
          for (const cb of fillListeners) cb(side[i] as 0 | 1);
        }
      }
    }

    for (let f = 0; f < FORMATION_COUNT; f++) {
      const ay = SPIN[f] * elapsed;
      rot[f * 4] = Math.cos(ay);
      rot[f * 4 + 1] = Math.sin(ay);
      rot[f * 4 + 2] = Math.cos(TILT[f]);
      rot[f * 4 + 3] = Math.sin(TILT[f]);
    }

    // Text sits over the particles on phones, so keep the accents quiet there.
    const accentStrength = isSmall() ? 0.3 : 1;
    // …and fade the whole field once you scroll past the hero.
    material.uniforms.uOpacity.value = baseOpacity * (isSmall() ? 1 - 0.6 * clamp01(progress) : 1);
    const k = Math.min(Math.floor(progress), FORMATION_COUNT - 2);
    const frac = clamp01(progress - k);
    const la = layoutFor(k);
    const lb = layoutFor(k + 1);

    for (let i = 0; i < COUNT; i++) {
      const t = smooth(clamp01((frac - delay[i] * 0.35) / 0.65));

      formationPosition(k, i, la);
      const ax = tmp[0];
      const ay = tmp[1];
      const az = tmp[2];
      formationPosition(k + 1, i, lb);
      positions[i * 3] = ax + (tmp[0] - ax) * t;
      positions[i * 3 + 1] = ay + (tmp[1] - ay) * t;
      positions[i * 3 + 2] = az + (tmp[2] - az) * t;

      // Heat: live fills in the order book, slow pulses elsewhere.
      const bookWeight = k === 0 ? 1 - t : 0;
      const pulse = accent[i] * accentStrength * (0.55 + 0.45 * Math.sin(elapsed * 1.6 + phase[i]));
      heatAttr[i] = Math.max(heat[i] * bookWeight, pulse * (1 - bookWeight));

      // Fade particles in as they enter at the far edge of the book.
      const edgeFade = heat[i] > 0 ? 1 : clamp01((1.04 - depthU[i]) / 0.12);
      alphaAttr[i] = edgeFade + (1 - edgeFade) * (1 - bookWeight);
    }

    posAttribute.needsUpdate = true;
    heatAttribute.needsUpdate = true;
    alphaAttribute.needsUpdate = true;

    const px = reducedMotion ? 0 : pointer.x * 0.7;
    const py = reducedMotion ? 0 : pointer.y * 0.45;
    camera.position.x += (px - camera.position.x) * Math.min(1, dt * 2.5);
    camera.position.y += (py - camera.position.y) * Math.min(1, dt * 2.5);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  return {
    setProgress(p) {
      progressTarget = Math.max(0, Math.min(FORMATION_COUNT - 1, p));
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
    },
    refreshTheme,
    onFill(cb) {
      fillListeners.push(cb);
    },
  };
}
