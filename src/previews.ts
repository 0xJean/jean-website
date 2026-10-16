/**
 * Live, code-drawn illustrations of each product. They are deliberately
 * generic (no real names, pairs or branding) and labelled as illustrations.
 *
 * To use a real screenshot instead, give the figure a `data-src`:
 *   <figure class="preview" data-preview="exchange" data-src="/previews/exchange.webp">
 */

interface Controller {
  start(): void;
  stop(): void;
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const fmt = (n: number, d = 1) =>
  n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

function ticker(fn: () => void, ms: number): Controller {
  let id = 0;
  return {
    start() {
      if (!id && !reduced) id = window.setInterval(fn, ms);
    },
    stop() {
      window.clearInterval(id);
      id = 0;
    },
  };
}

function ref<T extends Element = HTMLElement>(root: Element, key: string) {
  return root.querySelector(`[data-r="${key}"]`) as T;
}

function linePath(values: number[], w: number, h: number, pad = 6) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = pad + (1 - (v - min) / span) * (h - pad * 2);
      return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join('');
}

function walk(n: number, start: number, step: number, drift = 0) {
  const out = [start];
  for (let i = 1; i < n; i++) out.push(out[i - 1] + (Math.random() - 0.5 + drift) * step);
  return out;
}

// ── 01 · Exchange: order book, candles, trades ─────────────
function exchange(root: HTMLElement): Controller {
  root.insertAdjacentHTML(
    'beforeend',
    `<div class="pv pv-ex">
      <div class="pv-bar"><b>BTC / USDT</b><span class="pv-big" data-r="price"></span><span data-r="chg"></span><span class="pv-dim pv-hide-sm">Spot · Limit · Market</span></div>
      <div class="pv-ex-body">
        <div class="pv-book" data-r="book"></div>
        <svg class="pv-candles" viewBox="0 0 300 160" preserveAspectRatio="none" data-r="chart"></svg>
        <ol class="pv-trades pv-hide-sm" data-r="trades"></ol>
      </div>
    </div>`,
  );
  const open = 64218.5;
  let price = open;
  let ticks = 0;
  const candles: { o: number; h: number; l: number; c: number }[] = [];
  let p = open - 300;
  for (let i = 0; i < 30; i++) {
    const o = p;
    const c = o + (Math.random() - 0.42) * 40;
    candles.push({ o, c, h: Math.max(o, c) + Math.random() * 14, l: Math.min(o, c) - Math.random() * 14 });
    p = c;
  }
  price = p;

  const book = ref(root, 'book');
  const chart = ref<SVGSVGElement>(root, 'chart');
  const trades = ref(root, 'trades');

  function render() {
    ref(root, 'price').textContent = fmt(price);
    const chg = ((price - open) / open) * 100;
    const chgEl = ref(root, 'chg');
    chgEl.textContent = `${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%`;
    chgEl.className = chg >= 0 ? 'pv-up' : 'pv-down';

    const rows: string[] = [];
    const sizes = Array.from({ length: 5 }, () => Math.random() * 2.5 + 0.05);
    const max = sizes.reduce((a, b) => a + b, 0);
    let cum = max;
    for (let i = 4; i >= 0; i--) {
      rows.push(
        `<div class="ask"><span>${fmt(price + (i + 1) * 0.5)}</span><span>${sizes[i].toFixed(3)}</span><i style="width:${(cum / max) * 100}%"></i></div>`,
      );
      cum -= sizes[i];
    }
    rows.push(`<div class="mid">${fmt(price)}</div>`);
    cum = 0;
    for (let i = 0; i < 5; i++) {
      const s = Math.random() * 2.5 + 0.05;
      cum += s;
      rows.push(
        `<div class="bid"><span>${fmt(price - (i + 1) * 0.5)}</span><span>${s.toFixed(3)}</span><i style="width:${Math.min(100, (cum / max) * 100)}%"></i></div>`,
      );
    }
    book.innerHTML = rows.join('');

    const lo = Math.min(...candles.map((c) => c.l));
    const hi = Math.max(...candles.map((c) => c.h));
    const y = (v: number) => 8 + (1 - (v - lo) / (hi - lo)) * 144;
    chart.innerHTML = candles
      .map((c, i) => {
        const x = i * 10 + 2;
        const up = c.c >= c.o;
        const cls = up ? 'pv-c-up' : 'pv-c-down';
        return `<line class="${cls}" x1="${x + 3}" x2="${x + 3}" y1="${y(c.h)}" y2="${y(c.l)}"/><rect class="${cls}" x="${x}" width="6" y="${Math.min(y(c.o), y(c.c))}" height="${Math.max(1, Math.abs(y(c.o) - y(c.c)))}"/>`;
      })
      .join('');
  }

  function tick() {
    ticks++;
    price += (Math.random() - 0.48) * 9;
    const last = candles[candles.length - 1];
    last.c = price;
    last.h = Math.max(last.h, price);
    last.l = Math.min(last.l, price);
    if (ticks % 6 === 0) {
      candles.shift();
      candles.push({ o: price, c: price, h: price, l: price });
    }
    const buy = Math.random() > 0.5;
    trades.insertAdjacentHTML(
      'afterbegin',
      `<li class="${buy ? 'bid' : 'ask'}"><span>${fmt(price)}</span><span>${(Math.random() * 1.5).toFixed(3)}</span></li>`,
    );
    while (trades.children.length > 12) trades.lastElementChild!.remove();
    render();
  }

  render();
  for (let i = 0; i < 10; i++) tick();
  return ticker(tick, 650);
}

// ── 02 · Perpetuals DEX: mark price + order ticket ─────────
function perps(root: HTMLElement): Controller {
  root.insertAdjacentHTML(
    'beforeend',
    `<div class="pv pv-perp">
      <div class="pv-perp-chart">
        <div class="pv-bar"><b>ETH-PERP</b><span class="pv-big" data-r="price"></span><span class="pv-dim pv-hide-sm">Mark · On-chain</span></div>
        <svg viewBox="0 0 300 150" preserveAspectRatio="none"><path class="pv-area" data-r="area"/><path class="pv-line" data-r="line"/></svg>
        <div class="pv-perp-foot"><span>Funding <b>0.0100%</b></span><span>Next <b data-r="cd">02:14:33</b></span></div>
      </div>
      <div class="pv-ticket">
        <div class="pv-seg"><span class="on">Long</span><span>Short</span></div>
        <label>Leverage <b data-r="lev">20×</b></label>
        <div class="pv-slider"><i data-r="levbar"></i></div>
        <label>Size</label>
        <div class="pv-field">2.500 <span>ETH</span></div>
        <div class="pv-row"><span>Liq. price</span><b data-r="liq"></b></div>
        <div class="pv-cta">Open Long</div>
        <div class="pv-chains"><i></i><i></i><i></i><span>Multi-chain</span></div>
      </div>
    </div>`,
  );
  let series = walk(60, 3412, 6, 0.05);
  let countdown = 2 * 3600 + 14 * 60 + 33;
  let lev = 20;

  function render() {
    const price = series[series.length - 1];
    ref(root, 'price').textContent = fmt(price, 2);
    const line = linePath(series, 300, 150);
    ref(root, 'line').setAttribute('d', line);
    ref(root, 'area').setAttribute('d', `${line}L300,150L0,150Z`);
    ref(root, 'liq').textContent = fmt(price * (1 - 0.9 / lev), 2);
    ref(root, 'lev').textContent = `${lev}×`;
    (ref(root, 'levbar') as HTMLElement).style.width = `${(lev / 50) * 100}%`;
    const h = Math.floor(countdown / 3600);
    const m = Math.floor((countdown % 3600) / 60);
    const s = countdown % 60;
    ref(root, 'cd').textContent = [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  }

  function tick() {
    series = [...series.slice(1), series[series.length - 1] + (Math.random() - 0.47) * 6];
    countdown = countdown > 0 ? countdown - 1 : 8 * 3600;
    if (Math.random() < 0.08) lev = [5, 10, 20, 25, 40][Math.floor(Math.random() * 5)];
    render();
  }

  render();
  return ticker(tick, 1000);
}

// ── 03 · Payment rail: POS terminal checkout loop ──────────
function payments(root: HTMLElement): Controller {
  const tokens = ['USDT', 'USDC', 'ETH', 'BTC', 'SOL', 'TRX'];
  // 21×21 QR-like grid with three finder squares.
  const cells: string[] = [];
  const finder = (x: number, y: number) =>
    `<rect x="${x}" y="${y}" width="7" height="7" class="pv-qr-f"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
  for (let y = 0; y < 21; y++)
    for (let x = 0; x < 21; x++) {
      const inFinder = (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12);
      if (!inFinder && Math.random() > 0.55) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`);
    }
  const qr = `<svg viewBox="0 0 21 21" class="pv-qr">${cells.join('')}${finder(0, 0)}${finder(14, 0)}${finder(0, 14)}</svg>`;

  root.insertAdjacentHTML(
    'beforeend',
    `<div class="pv pv-pos">
      <div class="pv-device">
        <div class="pv-screen" data-r="screen"></div>
        <div class="pv-keys">${'<i></i>'.repeat(12)}</div>
      </div>
      <div class="pv-ledger">
        <div class="pv-bar"><b>Settlements</b><span class="pv-dim">live</span></div>
        <ol data-r="log"></ol>
      </div>
    </div>`,
  );
  const screen = ref(root, 'screen');
  const log = ref(root, 'log');
  let step = 0;
  let amount = 42;
  let token = 'USDT';
  let store = 412;
  let settle = 1.4;

  function render() {
    if (step === 0) {
      screen.innerHTML = `<small>Amount due</small><strong>${fmt(amount, 2)}</strong><small>USD</small>`;
    } else if (step === 1) {
      screen.innerHTML = `<small>Pay with</small><ul>${tokens
        .map((t) => `<li class="${t === token ? 'on' : ''}">${t}</li>`)
        .join('')}</ul>`;
    } else if (step === 2) {
      screen.innerHTML = `${qr}<small>Scan to pay · ${token}</small>`;
    } else {
      screen.innerHTML = `<span class="pv-ok">✓</span><strong>Paid</strong><small>Settled in ${settle.toFixed(1)}s</small>`;
    }
  }

  function addLog() {
    store = 100 + Math.floor(Math.random() * 900);
    log.insertAdjacentHTML(
      'afterbegin',
      `<li><span>Store #${store}</span><span>${fmt(amount, 2)} ${token}</span><span class="pv-dim">${settle.toFixed(1)}s</span></li>`,
    );
    while (log.children.length > 9) log.lastElementChild!.remove();
  }

  function tick() {
    step = (step + 1) % 4;
    if (step === 0) {
      amount = Math.round((5 + Math.random() * 120) * 100) / 100;
      token = tokens[Math.floor(Math.random() * tokens.length)];
    }
    if (step === 3) {
      settle = 0.9 + Math.random();
      addLog();
    }
    render();
  }

  for (let i = 0; i < 6; i++) {
    amount = Math.round((5 + Math.random() * 120) * 100) / 100;
    token = tokens[Math.floor(Math.random() * tokens.length)];
    settle = 0.9 + Math.random();
    addLog();
  }
  render();
  return ticker(tick, 1500);
}

// ── 04 · Quant: equity curve + strategy book ───────────────
function quant(root: HTMLElement): Controller {
  const strategies = ['BTC-PERP · Trend', 'ETH-PERP · Mean reversion', 'Alt basket · Momentum'];
  root.insertAdjacentHTML(
    'beforeend',
    `<div class="pv pv-quant">
      <div class="pv-bar"><b>Strategy equity</b><span class="pv-rank">#7 · Leaderboard</span><span class="pv-dim pv-hide-sm">Copy-trading on</span></div>
      <svg viewBox="0 0 300 120" preserveAspectRatio="none" class="pv-equity"><path class="pv-area" data-r="area"/><path class="pv-line" data-r="line"/></svg>
      <ul class="pv-strats">${strategies
        .map(
          (s, i) =>
            `<li><span>${s}</span><b data-r="side${i}"></b><svg viewBox="0 0 80 20" preserveAspectRatio="none"><path class="pv-line" data-r="spark${i}"/></svg></li>`,
        )
        .join('')}</ul>
    </div>`,
  );
  const full = walk(140, 100, 3, 0.18);
  let shown = 40;
  const sparks = strategies.map(() => walk(24, 10, 2, 0.12));
  const sides = strategies.map(() => (Math.random() > 0.3 ? 'LONG' : 'SHORT'));

  function render() {
    const vis = full.slice(0, shown);
    const lo = Math.min(...full);
    const hi = Math.max(...full);
    const path = vis
      .map((v, i) => `${i ? 'L' : 'M'}${((i / (full.length - 1)) * 300).toFixed(1)},${(6 + (1 - (v - lo) / (hi - lo)) * 108).toFixed(1)}`)
      .join('');
    const endX = (((vis.length - 1) / (full.length - 1)) * 300).toFixed(1);
    ref(root, 'line').setAttribute('d', path);
    ref(root, 'area').setAttribute('d', `${path}L${endX},120L0,120Z`);
    strategies.forEach((_, i) => {
      ref(root, `spark${i}`).setAttribute('d', linePath(sparks[i], 80, 20, 2));
      const sideEl = ref(root, `side${i}`);
      sideEl.textContent = sides[i];
      sideEl.className = sides[i] === 'LONG' ? 'pv-up' : 'pv-down';
    });
  }

  function tick() {
    shown = shown >= full.length ? 40 : shown + 1;
    sparks.forEach((s, i) => {
      s.shift();
      s.push(s[s.length - 1] + (Math.random() - 0.4) * 2);
      if (Math.random() < 0.04) sides[i] = sides[i] === 'LONG' ? 'SHORT' : 'LONG';
    });
    render();
  }

  if (reduced) shown = full.length;
  render();
  return ticker(tick, 220);
}

const builders: Record<string, (root: HTMLElement) => Controller> = { exchange, perps, payments, quant };

export function mountPreviews() {
  document.querySelectorAll<HTMLElement>('[data-preview]').forEach((el) => {
    const src = el.dataset.src;
    if (src) {
      el.classList.add('preview-image');
      el.insertAdjacentHTML('beforeend', `<img src="${src}" alt="" loading="lazy" />`);
      el.querySelector('.pv-tag')?.remove();
      return;
    }
    const build = builders[el.dataset.preview!];
    if (!build) return;
    const ctl = build(el);
    new IntersectionObserver(([entry]) => (entry.isIntersecting ? ctl.start() : ctl.stop())).observe(el);
  });
}
