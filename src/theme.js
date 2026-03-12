/* ============================================================
   THEMES & CONSTANTS
   ============================================================ */
export const THEMES = {
  dark: {
    bg:        "#060608",
    surface:   "rgba(14,14,20,0.82)",
    surface2:  "rgba(22,22,30,0.90)",
    border:    "#2e2e3e",
    text:      "#d4d4e0",
    muted:     "#72728a",
    white:     "#ffffff",
    green:     "#00ff88",
    greenDim:  "rgba(0,255,136,0.12)",
    greenGlow: "rgba(0,255,136,0.35)",
    cyan:      "#00e5ff",
    orange:    "#ffb347",
    red:       "#ff4757",
  },
  light: {
    bg:        "#e8eaf0",
    surface:   "rgba(255,255,255,0.88)",
    surface2:  "rgba(220,224,234,0.92)",
    border:    "#a8aabf",
    text:      "#12122a",
    muted:     "#5a5a78",
    white:     "#0a0a1a",
    green:     "#007a40",
    greenDim:  "rgba(0,122,64,0.10)",
    greenGlow: "rgba(0,122,64,0.22)",
    cyan:      "#005a8c",
    orange:    "#b05000",
    red:       "#c0001a",
  },
};

export const FONT = "'JetBrains Mono','Fira Code','Courier New',monospace";

/* ============================================================
   GLOBAL CSS — injected dynamically so it reacts to theme
   ============================================================ */
export const makeCSS = (C) => `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.bg}; color: ${C.text}; font-family: ${FONT}; overflow-x: hidden; transition: background .4s, color .4s; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.green}66; border-radius: 2px; }

  @keyframes slideUp  { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:none } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes pulse    { 0%,100% { opacity:1 } 50% { opacity:.3 } }
  @keyframes float    { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-10px) } }
  @keyframes scanMove { from { transform:translateY(-100%) } to { transform:translateY(100vh) } }
  @keyframes glitch1  { 0%,100%{clip-path:inset(40% 0 61% 0)} 20%{clip-path:inset(92% 0 1% 0)} 60%{clip-path:inset(25% 0 58% 0)} }
  @keyframes glitch2  { 0%,100%{clip-path:inset(25% 0 58% 0);transform:translateX(2px)} 40%{clip-path:inset(54% 0 7% 0);transform:translateX(-2px)} }

  .lift { transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s; }
  .lift:hover { transform: translateY(-4px); }

  @media (max-width: 768px) {
    .hide-mob  { display: none !important; }
    .col-2     { grid-template-columns: 1fr !important; }
    .col-proj  { grid-template-columns: 1fr !important; }
    .stats-row { flex-direction: column !important; }
    .stat-item { border-right: none !important; border-bottom: 1px solid ${C.border} !important; }
    .pad       { padding: 4rem 1.3rem !important; }
    .h1-hero   { font-size: clamp(2.2rem,10vw,4rem) !important; }
  }
`;
