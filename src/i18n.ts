export type Lang = 'en' | 'zh';

type Dict = Record<string, string>;

export const en: Dict = {
  'meta.title': 'Jean — Web3 Architect & Founder',
  'meta.desc':
    'I’m Jean — engineer and serial founder. Since 2017 I’ve been designing exchanges, derivatives and payment systems in Web3.',

  'nav.about': 'About',
  'nav.products': 'Products',
  'nav.stack': 'Toolbox',
  'nav.contact': 'Contact',
  'nav.role': 'Architect · Founder',

  'hero.eyebrow': 'Web3 architect · Serial founder · On-chain since 2017',
  'hero.title': 'I’m Jean.<br>I build the engines<br><em>markets run on.</em>',
  'hero.sub':
    'Engineer and serial founder. Sixteen years of shipping software, twelve of starting companies — and since 2017, designing the exchanges, derivatives and payment systems behind crypto.',
  'cta.tg': 'Message me on Telegram',
  'cta.x': 'Follow on X',
  'cta.gh': 'GitHub',
  'ticker.label': 'Matching engine · simulated',
  'ticker.rate': 'fills / s',
  'hero.scroll': 'Scroll — this is what I build',

  'about.k': '01 — About',
  'about.title': 'Engineer first.<br><em>Founder by habit.</em>',
  'about.p1':
    'I’ve been writing production software since 2010 and building companies since 2014. In 2017 I moved into crypto full-time — less for the tokens than for the engineering: financial infrastructure where a single bug can cost millions and every minute of downtime costs trust.',
  'about.p2':
    'Since then I’ve taken four products from a blank page to real scale — a centralized exchange, an on-chain perpetuals exchange, a crypto payment network running on thousands of point-of-sale terminals, and a quant trading system — as founder, co-founder, CEO or CTO. I sit where the business and the architecture meet: deciding what to build, then making sure it holds.',
  'about.p3':
    'My bar is simple: if it moves money, it has to be boring — predictable under load, paranoid about keys, and run by a team that doesn’t need me in the room.',
  'stat.1': 'years shipping software',
  'stat.2': 'years in Web3',
  'stat.3': 'years as a founder',
  'stat.4': 'handled by systems I designed',

  'path.k': '02 — Path',
  'path.title': 'How I got here.',
  'p1.year': '2010',
  'p1.name': 'First production code',
  'p1.desc': 'Started building software end to end — backend, frontend, infrastructure — and never stopped.',
  'p2.year': '2014',
  'p2.name': 'First company',
  'p2.desc': 'Founded my first startup and learned that architecture decisions are business decisions.',
  'p3.year': '2017',
  'p3.name': 'All-in on Web3',
  'p3.desc': 'Moved into crypto full-time, starting at the hardest layer: trading, custody and settlement.',
  'p4.year': 'Since',
  'p4.name': 'Exchanges, perps, payments, quant',
  'p4.desc':
    'Built the four products below as founder, co-founder, CEO or CTO — each handling real money at real scale.',
  'p5.year': 'Now',
  'p5.name': 'The next hard problem',
  'p5.desc': 'Open to partnering with founders and investors on ambitious financial infrastructure.',

  'work.k': '03 — Products',
  'work.title': 'Things I’ve built.',
  'work.nda':
    'Names and links stay private at partners’ request — happy to walk through any of these in detail over a call.',
  'label.role': 'My role',
  'label.built': 'What I built',
  'pv.tag': 'Illustration',

  'c1.tag': 'Centralized exchange',
  'c1.name': 'A crypto exchange, from a blank page',
  'c1.what': 'A full-featured spot exchange serving over a million daily active users.',
  'c1.role':
    'Founding team and technical lead — designed the whole system end to end and led engineering through launch.',
  'c1.built':
    'An in-memory matching engine with millisecond latency, a data layer built for hundreds of millions of records, and hot/cold multisig custody that passed a financial-grade audit.',
  'c1.m1': 'matching latency',
  'c1.m2': 'daily active users',
  'c1.m3': 'assets lost',

  'c2.tag': 'On-chain perpetuals',
  'c2.name': 'A perpetuals exchange that lives on-chain',
  'c2.what': 'A decentralized exchange for perpetual futures, deployed across multiple chains.',
  'c2.role':
    'Founding team — led the protocol architecture and the smart-contract engineering.',
  'c2.built':
    'Hundreds of in-house smart contracts forming a complete perpetuals ecosystem, with order matching that runs fully on-chain.',
  'c2.m1': 'total value locked',
  'c2.m2': 'users',
  'c2.m3': 'daily volume',

  'c3.tag': 'Retail crypto payments',
  'c3.name': 'Paying with crypto at the checkout counter',
  'c3.what': 'A payment network that lets shops around the world accept dozens of tokens at the till.',
  'c3.role':
    'Founding team — designed the payment and custody architecture and led the build.',
  'c3.built':
    'A gateway with HSM-protected keys and settlement in seconds, connected to thousands of point-of-sale terminals worldwide.',
  'c3.m1': 'POS terminals',
  'c3.m2': 'daily payment volume',
  'c3.m3': 'security incidents',

  'c4.tag': 'Quantitative trading',
  'c4.name': 'A quant system with a public scoreboard',
  'c4.what': 'Automated trading strategies on perpetual futures that others can follow through copy-trading.',
  'c4.role':
    'Founder — built the system and the strategies myself.',
  'c4.built':
    'A multi-asset perpetuals engine with copy-trading support, whose performance is public and verifiable.',
  'c4.m1': 'on the Binance leaderboard',
  'c4.m2': 'copy-trading',

  'work.also': 'Smaller bets',
  'a1.name': 'AI video × ERC-404',
  'a1.desc': 'An AI video-generation product whose creations live on-chain as ERC-404 assets.',
  'a2.name': 'GameFi',
  'a2.desc': 'A game-meets-finance product built around an on-chain economy.',
  'a3.name': 'Token swap',
  'a3.desc': 'A decentralized exchange for swapping tokens directly from your wallet.',
  'a4.name': 'x402 payments',
  'a4.desc': 'An on-chain payment product built on x402, the HTTP-native payment protocol.',
  'a5.name': 'NFT synthetics',
  'a5.desc': 'A product for composing NFTs into new, synthetic on-chain assets.',
  'a6.name': 'Token toolkit',
  'a6.desc': 'Self-serve tooling for issuing and managing tokens.',

  'stack.k': '04 — Toolbox',
  'stack.title': 'Full stack, in the literal sense.',
  'stack.sub': 'From bytecode to the checkout counter — I’ve shipped every layer of a financial system.',
  'l4.name': 'Application',
  'l4.items': 'Wallets · POS payments · GameFi · AI video',
  'l3.name': 'Custody & security',
  'l3.items': 'HSM · Hot/cold multisig custody · Wallet security protocols · Settlement in seconds',
  'l2.name': 'Engine',
  'l2.items': 'In-memory matching · Microservices · Distributed queues · High concurrency · 100M-scale data',
  'l1.name': 'Protocol',
  'l1.items': 'Solidity · Rust · EVM & gas optimization · Cross-chain messaging · ERC-404 · x402',

  'engage.k': '05 — Working together',
  'engage.title': 'Where I can help.',
  'e1.name': 'As your technical partner',
  'e1.desc':
    'You’re building an exchange, a derivatives venue or a payment product and need an engine, not a template. I join as technical co-founder or partner.',
  'e2.name': 'As a second pair of eyes',
  'e2.desc':
    'You’re an investor or a team weighing exchange, DeFi or payments technology. I’ll tell you honestly what holds up and what doesn’t.',
  'e3.name': 'As the one who builds it',
  'e3.desc': 'I assemble the team, set the architecture, and take the product from zero to an audited launch.',

  'contact.k': '06 — Contact',
  'contact.title': 'Got a hard problem?<br><em>Let’s talk.</em>',
  'contact.sub': 'Telegram is the fastest way to reach me. On X I share what I’m building and thinking about; code lives on GitHub.',
  'footer.copy': '© 2026 Jean',
  'footer.status': 'All systems nominal',
};

const zh: Dict = {
  'meta.title': 'Jean — Web3 架構師 · 創業者',
  'meta.desc': '我是 Jean，工程師、連續創業者。2017 年起在 Web3 設計交易所、衍生品與支付系統。',

  'nav.about': '關於',
  'nav.products': '產品',
  'nav.stack': '技術',
  'nav.contact': '聯繫',
  'nav.role': '架構師 · 創業者',

  'hero.eyebrow': 'Web3 架構師 · 連續創業者 · 2017 年起深耕鏈上',
  'hero.title': '我是 Jean。<br>我打造<br><em>市場賴以運轉的引擎。</em>',
  'hero.sub':
    '工程師，也是連續創業者。十六年軟體開發、十二年創業——2017 年起，專注設計加密世界背後的交易所、衍生品與支付系統。',
  'cta.tg': 'Telegram 找我',
  'cta.x': '在 X 上關注',
  'cta.gh': 'GitHub',
  'ticker.label': '撮合引擎 · 模擬',
  'ticker.rate': '筆成交 / 秒',
  'hero.scroll': '向下滾動——這就是我打造的東西',

  'about.k': '01 — 關於我',
  'about.title': '首先是工程師，<br><em>習慣性地創業。</em>',
  'about.p1':
    '我從 2010 年開始寫生產級程式碼，2014 年開始創業。2017 年全職投入加密領域——吸引我的不是代幣，而是工程本身：在這裡，一個 bug 可能損失數百萬，每一分鐘的停機都在消耗信任。',
  'about.p2':
    '此後，我以創始人、聯合創始人、CEO 或 CTO 的身份，把四個產品從一張白紙做到真實規模：一家中心化交易所、一個鏈上永續合約交易所、一個運行在全球數千台 POS 終端上的加密支付網路，以及一套量化交易系統。我習慣站在商業與架構的交會點：先決定做什麼，再確保它扛得住。',
  'about.p3':
    '我的標準很簡單：只要經手資金，系統就必須「無聊」——高負載下可預期、對金鑰保持偏執，並由一支不需要我在場也能運轉的團隊來維護。',
  'stat.1': '年軟體開發',
  'stat.2': '年 Web3 實戰',
  'stat.3': '年創業經歷',
  'stat.4': '經我設計的系統累計處理資金（十億美元級）',

  'path.k': '02 — 經歷',
  'path.title': '我是怎麼走到這裡的。',
  'p1.year': '2010',
  'p1.name': '第一行生產級程式碼',
  'p1.desc': '開始端到端地構建軟體——後端、前端、基礎設施——從此沒有停下。',
  'p2.year': '2014',
  'p2.name': '第一次創業',
  'p2.desc': '創立第一家公司，明白了架構決策就是商業決策。',
  'p3.year': '2017',
  'p3.name': '全心投入 Web3',
  'p3.desc': '全職進入加密領域，從最難的一層做起：交易、託管與結算。',
  'p4.year': '此後',
  'p4.name': '交易所、永續、支付、量化',
  'p4.desc':
    '以創始人、聯合創始人、CEO 或 CTO 的身份打造了下面四個產品，每一個都承載著真實的資金與規模。',
  'p5.year': '現在',
  'p5.name': '下一個難題',
  'p5.desc': '期待與創始人和投資人一起，打造有野心的金融基礎設施。',

  'work.k': '03 — 產品',
  'work.title': '我做過的東西。',
  'work.nda': '應合作方要求，產品名稱與連結暫不公開——歡迎約時間，我可以詳細介紹其中任何一個。',
  'label.role': '我的角色',
  'label.built': '我做了什麼',
  'pv.tag': '示意圖',

  'c1.tag': '中心化交易所',
  'c1.name': '從一張白紙開始的加密交易所',
  'c1.what': '功能完整的現貨交易所，日活躍用戶超過百萬。',
  'c1.role':
    '創始團隊成員兼技術負責人——端到端設計整套系統，帶領工程團隊直到上線。',
  'c1.built': '毫秒級響應的記憶體撮合引擎、承載億級資料的資料層，以及通過金融級安全審計的冷熱多簽託管體系。',
  'c1.m1': '撮合延遲',
  'c1.m2': '日活躍用戶',
  'c1.m3': '資產損失',

  'c2.tag': '鏈上永續合約',
  'c2.name': '完全運行在鏈上的永續合約交易所',
  'c2.what': '去中心化的永續合約交易所，部署於多條公鏈。',
  'c2.role':
    '創始團隊成員——主導協議架構與智能合約開發。',
  'c2.built': '自研數百個智能合約，構建完整的永續合約生態，訂單撮合完全在鏈上執行。',
  'c2.m1': '鎖倉總值',
  'c2.m2': '用戶',
  'c2.m3': '日交易量',

  'c3.tag': '線下加密支付',
  'c3.name': '在收銀台用加密貨幣付款',
  'c3.what': '讓全球商家在收銀台直接收取數十種代幣的支付網路。',
  'c3.role':
    '創始團隊成員——設計支付與託管架構，並主導開發。',
  'c3.built': 'HSM 硬體加密保護金鑰、秒級到帳的支付閘道，連接全球數千台 POS 終端。',
  'c3.m1': 'POS 終端',
  'c3.m2': '日支付額度',
  'c3.m3': '安全事故',

  'c4.tag': '量化交易',
  'c4.name': '戰績公開可查的量化系統',
  'c4.what': '永續合約自動化交易策略，其他人可以透過跟單參與。',
  'c4.role':
    '創始人——系統與策略均由我親自打造。',
  'c4.built': '支援多幣種永續合約與策略跟單的量化引擎，績效公開、可查證。',
  'c4.m1': '幣安排行榜名次',
  'c4.m2': '策略跟單',

  'work.also': '其他嘗試',
  'a1.name': 'AI 影片 × ERC-404',
  'a1.desc': 'AI 影片生成產品，作品以 ERC-404 資產的形式存在於鏈上。',
  'a2.name': 'GameFi',
  'a2.desc': '圍繞鏈上經濟打造的遊戲化金融產品。',
  'a3.name': '代幣兌換',
  'a3.desc': '直接從錢包兌換代幣的去中心化交易所。',
  'a4.name': 'x402 支付',
  'a4.desc': '基於 x402（HTTP 原生支付協議）的鏈上支付產品。',
  'a5.name': 'NFT 合成資產',
  'a5.desc': '將多個 NFT 組合成全新鏈上合成資產的產品。',
  'a6.name': '代幣工具箱',
  'a6.desc': '自助發行與管理代幣的工具。',

  'stack.k': '04 — 技術',
  'stack.title': '真正意義上的全棧。',
  'stack.sub': '從位元組碼到收銀台——金融系統的每一層，我都親手交付過。',
  'l4.name': '應用層',
  'l4.items': '錢包 · POS 支付 · GameFi · AI 影片',
  'l3.name': '託管與安全',
  'l3.items': 'HSM · 冷熱多簽託管 · 錢包安全協議 · 秒級結算',
  'l2.name': '引擎層',
  'l2.items': '記憶體撮合 · 微服務 · 分散式訊息佇列 · 高併發 · 億級資料',
  'l1.name': '協議層',
  'l1.items': 'Solidity · Rust · EVM 與 Gas 優化 · 跨鏈通訊 · ERC-404 · x402',

  'engage.k': '05 — 合作',
  'engage.title': '我能幫上忙的地方。',
  'e1.name': '作為你的技術合夥人',
  'e1.desc': '你正在打造交易所、衍生品平台或支付產品，需要的是引擎而不是模板。我以技術聯合創始人或合夥人的身份加入。',
  'e2.name': '作為第二雙眼睛',
  'e2.desc': '你是投資人或團隊，正在評估交易所、DeFi 或支付技術。我會坦白告訴你哪些站得住、哪些站不住。',
  'e3.name': '作為親手打造的人',
  'e3.desc': '組建團隊、確立架構，帶領產品從零走到通過審計的上線。',

  'contact.k': '06 — 聯繫',
  'contact.title': '手上有難題？<br><em>聊聊吧。</em>',
  'contact.sub': 'Telegram 是最快找到我的方式；我會在 X 上分享正在做的事和想法，程式碼則在 GitHub。',
  'footer.copy': '© 2026 Jean',
  'footer.status': '系統運行正常',
};

const dicts: Record<Lang, Dict> = { en, zh };

const STORAGE_KEY = 'jean.lang';

export function initialLang(): Lang {
  const param = new URLSearchParams(location.search).get('lang');
  if (param === 'zh' || param === 'en') return param;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
  } catch {
    /* storage unavailable */
  }
  // English is the default; only Traditional Chinese locales start in zh.
  return /^zh-(tw|hk|mo|hant)/i.test(navigator.language) ? 'zh' : 'en';
}

export function applyLang(lang: Lang) {
  const dict = dicts[lang];
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = dict['meta.title'];
  document.querySelector('meta[name="description"]')?.setAttribute('content', dict['meta.desc']);
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const value = dict[el.dataset.i18n!];
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
  });
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable */
  }
}
