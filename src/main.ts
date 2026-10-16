import './style.css';
import { GITHUB_URL, TELEGRAM_URL, X_URL } from './config';
import { applyLang, initialLang, type Lang } from './i18n';
import { createEngine, type Engine } from './engine';
import { mountPreviews } from './previews';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Language ────────────────────────────────────────────────
applyLang(initialLang());
document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang as Lang));
});

// ── Contact links ───────────────────────────────────────────
document.querySelectorAll<HTMLAnchorElement>('[data-link]').forEach((a) => {
  a.href = { tg: TELEGRAM_URL, x: X_URL, gh: GITHUB_URL }[a.dataset.link!] ?? X_URL;
});

mountPreviews();

// ── 3D engine ───────────────────────────────────────────────
let engine: Engine | null = null;
try {
  engine = createEngine(document.getElementById('engine') as HTMLCanvasElement, reducedMotion);
} catch {
  document.documentElement.classList.add('no-webgl');
}

const nav = document.querySelector('.nav') as HTMLElement;
const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-formation]'));

function updateProgress() {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  if (!engine) return;
  const probe = window.scrollY + window.innerHeight * 0.5;
  let k = 0;
  while (k < sections.length - 1 && sections[k + 1].offsetTop <= probe) k++;
  if (k === sections.length - 1) {
    engine.setProgress(k);
    return;
  }
  const top = sections[k].offsetTop;
  const next = sections[k + 1].offsetTop;
  const frac = (probe - top) / (next - top);
  // Hold each formation for most of its section, morph in the last stretch.
  engine.setProgress(k + Math.max(0, Math.min(1, (frac - 0.5) / 0.5)));
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

window.addEventListener(
  'pointermove',
  (e) => {
    if (e.pointerType !== 'mouse') return;
    engine?.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
  },
  { passive: true },
);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => engine?.refreshTheme());

// ── Tape: a live log of fills coming out of the engine ──────
const tape = document.getElementById('tape') as HTMLOListElement;
const rateEl = document.getElementById('fill-rate') as HTMLElement;
let price = 64218.5;
let fills = 0;
let lastRow = 0;

function pushRow(sideIdx: 0 | 1) {
  price = Math.max(1000, price + (Math.random() - 0.5) * 6);
  const qty = (Math.random() * 2.4 + 0.01).toFixed(3);
  const latency = (0.18 + Math.random() * 0.7).toFixed(2);
  const li = document.createElement('li');
  li.className = sideIdx ? 'ask' : 'bid';
  li.innerHTML = `<span>${sideIdx ? 'SELL' : 'BUY'}</span><span>${qty}</span><span>${price.toLocaleString('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}</span><span>${latency}ms</span>`;
  tape.prepend(li);
  while (tape.children.length > 6) tape.lastElementChild!.remove();
}

engine?.onFill((sideIdx) => {
  fills++;
  const now = performance.now();
  if (now - lastRow > 160) {
    lastRow = now;
    pushRow(sideIdx);
  }
});
setInterval(() => {
  rateEl.textContent = fills.toLocaleString('en-US');
  fills = 0;
}, 1000);

// ── Reveal + count-up ───────────────────────────────────────
function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (reducedMotion) return;
  const start = performance.now();
  const dur = 1100;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / dur);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const io = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('in');
      entry.target.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
      io.unobserve(entry.target);
    }
  },
  { rootMargin: '0px 0px -10% 0px' },
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
