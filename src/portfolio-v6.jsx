import { useState, useEffect, useRef, useCallback } from "react";

/* ============================================================
   THEMES
   ============================================================ */
const THEMES = {
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

const FONT = "'JetBrains Mono','Fira Code','Courier New',monospace";

/* ============================================================
   GLOBAL CSS — injected dynamically so it reacts to theme
   ============================================================ */
const makeCSS = (C) => `
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

/* ============================================================
   HOOKS
   ============================================================ */

/* types `text` char by char after `delay` ms */
function useTypewriter(text, speed = 40, delay = 0) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut(""); setDone(false);
    let i = 0, iv;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        setOut(text.slice(0, ++i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
    }, delay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, speed, delay]);
  return { out, done };
}

/* fires once when element enters viewport */
function useReveal(threshold = 0.12) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ============================================================
   SMALL SHARED COMPONENTS
   NOTE: every component that uses C must receive it as a prop
   ============================================================ */

/* blinking block cursor */
function Cursor({ color }) {
  const [on, setOn] = useState(true);
  useEffect(() => { const iv = setInterval(() => setOn(v => !v), 520); return () => clearInterval(iv); }, []);
  return (
    <span style={{ display: "inline-block", width: 9, height: "1.1em", background: on ? color : "transparent", verticalAlign: "middle", marginLeft: 2 }} />
  );
}

/* fade + slide up on scroll into view */
function Fade({ children, delay = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: `all .75s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

/* button or link with glow — requires C prop */
function GlowBtn({ children, href, primary, onClick, C }) {
  const [hov, setHov] = useState(false);
  const style = {
    padding: ".62rem 1.5rem", fontFamily: FONT, fontSize: ".72rem",
    fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
    cursor: "pointer", textDecoration: "none", display: "inline-block", transition: "all .2s",
    ...(primary
      ? { background: hov ? C.white : C.green, color: "#000", border: "none", boxShadow: `0 0 ${hov ? 30 : 12}px ${C.greenGlow}` }
      : { background: "transparent", color: hov ? C.green : C.text, border: `1px solid ${hov ? C.green : C.border}`, boxShadow: hov ? `0 0 18px ${C.greenGlow}` : "none" }),
  };
  const ev = { onMouseEnter: () => setHov(true), onMouseLeave: () => setHov(false) };
  return href
    ? <a href={href} target="_blank" rel="noreferrer" style={style} {...ev}>{children}</a>
    : <button style={style} onClick={onClick} {...ev}>{children}</button>;
}

/* macOS-style terminal window frame — requires C prop */
function TermWindow({ title, children, glow, C }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${glow || hov ? C.green + "88" : C.border}`,
        background: C.surface,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        boxShadow: glow || hov ? `0 0 40px ${C.greenGlow}, inset 0 0 20px ${C.greenDim}` : "0 4px 24px rgba(0,0,0,0.2)",
        transition: "all .35s",
      }}
    >
      {/* macOS traffic-light title bar */}
      <div style={{ background: C.surface2, padding: ".5rem 1rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: ".4rem" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: .9 }} />
        ))}
        <span style={{ fontSize: ".58rem", color: C.muted, marginLeft: ".5rem", letterSpacing: 1 }}>{title}</span>
      </div>
      <div style={{ padding: "1.4rem 1.8rem", fontFamily: FONT, fontSize: ".76rem", lineHeight: 2 }}>{children}</div>
    </div>
  );
}

/* gradient divider between sections — requires C prop */
function Divider({ C }) {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 2.5rem" }}>
      <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${C.border},transparent)` }} />
    </div>
  );
}

/* section label + decorative line — requires C prop */
function SectionHdr({ label, sub, C }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(14px)", transition: "all .7s", marginBottom: "3rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontSize: ".66rem", letterSpacing: 3, color: C.green, textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,${C.green}66,transparent)` }} />
        {sub && <span style={{ fontSize: ".6rem", color: C.muted, letterSpacing: 2, whiteSpace: "nowrap" }}>{sub}</span>}
      </div>
    </div>
  );
}

/* ============================================================
   BACKGROUND EFFECTS
   ============================================================ */

/* animated particle network — mouse-reactive — requires C prop */
function Particles({ C }) {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, raf;
    const mouse = { x: -999, y: -999 };

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - .5) * .28,
      vy: (Math.random() - .5) * .28,
      r: Math.random() * 1.4 + .5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      pts.forEach(p => {
        // move + wrap edges
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        // repel from cursor
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < 90) { p.x += (p.x - mouse.x) * .014; p.y += (p.y - mouse.y) * .014; }
        // bright dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = C.green + "99";
        ctx.fill();
      });

      // connecting lines between nearby dots
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const alpha = Math.round((1 - d / 130) * 45).toString(16).padStart(2, "0");
          ctx.strokeStyle = C.green + alpha;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }));

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [C.green]); // re-init if green color changes (theme switch)

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* CRT scanline overlay + moving sweep line */
function Scanlines({ C }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 997, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.02) 2px,rgba(0,0,0,0.02) 4px)" }} />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${C.green}55,transparent)`, pointerEvents: "none", zIndex: 998, animation: "scanMove 10s linear infinite" }} />
    </>
  );
}

/* chromatic-aberration glitch on name text */
function Glitch({ children }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => { setActive(true); setTimeout(() => setActive(false), 180); }, 4500);
    return () => clearInterval(iv);
  }, []);
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      {active && (
        <>
          <span aria-hidden style={{ position: "absolute", inset: 0, color: "#00e5ff", left: 2, animation: "glitch1 .14s steps(1) forwards" }}>{children}</span>
          <span aria-hidden style={{ position: "absolute", inset: 0, color: "#ff4757", left: -2, animation: "glitch2 .14s steps(1) forwards" }}>{children}</span>
        </>
      )}
    </span>
  );
}

/* ============================================================
   NAVIGATION — requires C prop
   ============================================================ */
const NAV_LINKS = ["home", "about", "projects", "skills", "contact"];

function Nav({ active, theme, toggleTheme, C }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navBg = scrolled
    ? (theme === "dark" ? "rgba(6,6,8,0.96)" : "rgba(232,234,240,0.96)")
    : "transparent";

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, padding: ".8rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: navBg, borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, backdropFilter: scrolled ? "blur(16px)" : "none", transition: "all .4s" }}>

      {/* logo */}
      <div onClick={() => scrollTo("home")} style={{ color: C.green, fontWeight: 700, fontSize: "1rem", letterSpacing: 3, cursor: "pointer", textShadow: `0 0 20px ${C.greenGlow}` }}>
        AM<span style={{ color: C.muted }}>_</span>DEV
      </div>

      {/* desktop: nav links + theme toggle */}
      <div className="hide-mob" style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
        <ul style={{ listStyle: "none", display: "flex", gap: ".15rem", margin: 0, padding: 0 }}>
          {NAV_LINKS.map(l => {
            const on = active === l;
            return (
              <li key={l}>
                <button onClick={() => scrollTo(l)} style={{ background: on ? C.greenDim : "transparent", border: `1px solid ${on ? C.green + "55" : "transparent"}`, color: on ? C.green : C.muted, fontFamily: FONT, fontSize: ".7rem", letterSpacing: "1.5px", padding: ".3rem .85rem", cursor: "pointer", transition: "all .2s", boxShadow: on ? `0 0 14px ${C.greenGlow}` : "none" }}
                  onMouseEnter={e => { if (!on) e.currentTarget.style.color = C.green; }}
                  onMouseLeave={e => { if (!on) e.currentTarget.style.color = C.muted; }}>
                  ./{l}
                </button>
              </li>
            );
          })}
        </ul>
        {/* theme toggle */}
        <button onClick={toggleTheme} style={{ marginLeft: ".5rem", background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, fontFamily: FONT, fontSize: ".72rem", padding: ".3rem .75rem", cursor: "pointer", transition: "all .2s", letterSpacing: 1 }}
          onMouseEnter={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.color = "#000"; }}
          onMouseLeave={e => { e.currentTarget.style.background = C.greenDim; e.currentTarget.style.color = C.green; }}>
          {theme === "dark" ? "☀ light" : "◉ dark"}
        </button>
      </div>

      {/* mobile: hamburger */}
      <button onClick={() => setMenuOpen(v => !v)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.green, fontFamily: FONT, fontSize: ".75rem", padding: ".3rem .8rem", cursor: "pointer", display: "none" }} className="show-mob">☰</button>

      {/* mobile fullscreen menu */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, background: theme === "dark" ? "rgba(6,6,8,.97)" : "rgba(232,234,240,.97)", zIndex: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "transparent", border: "none", color: C.muted, fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => scrollTo(l)} style={{ background: "transparent", border: "none", color: active === l ? C.green : C.text, fontFamily: FONT, fontSize: "1.5rem", letterSpacing: 4, cursor: "pointer" }}>./{l}</button>
          ))}
          <button onClick={toggleTheme} style={{ background: C.greenDim, border: `1px solid ${C.green}44`, color: C.green, fontFamily: FONT, fontSize: ".8rem", padding: ".4rem 1rem", cursor: "pointer", marginTop: "1rem" }}>
            {theme === "dark" ? "☀ switch to light" : "◉ switch to dark"}
          </button>
        </div>
      )}
    </nav>
  );
}

/* ============================================================
   HOME SECTION
   ============================================================ */
function Home({ C }) {
  const name = useTypewriter("Abdallah Marouf", 65, 600);
  const role = useTypewriter("Software Engineer · 1337 / 42 Network", 38, 2200);

  return (
    <section id="home" className="pad" style={{ maxWidth: 980, margin: "0 auto", padding: "10rem 2.5rem 6rem", position: "relative", zIndex: 2, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>

      {/* ambient green glow blobs */}
      <div style={{ position: "absolute", top: "20%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle,${C.greenGlow} 0%,transparent 65%)`, pointerEvents: "none", filter: "blur(30px)", animation: "float 6s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "-5%", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle,${C.greenGlow} 0%,transparent 65%)`, pointerEvents: "none", filter: "blur(25px)", animation: "float 8s ease-in-out infinite reverse" }} />

      {/* availability badge */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: ".5rem", border: `1px solid ${C.green}44`, background: C.greenDim, padding: ".3rem .9rem", alignSelf: "flex-start", marginBottom: "2.5rem", animation: "fadeIn .8s ease .2s both" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: "pulse 2s ease infinite" }} />
        <span style={{ fontSize: ".62rem", color: C.green, letterSpacing: 2 }}>AVAILABLE FOR INTERNSHIP</span>
      </div>

      {/* headline with typewriter name + glitch effect */}
      <h1 className="h1-hero" style={{ fontFamily: FONT, fontWeight: 700, fontSize: "clamp(2.8rem,6.5vw,5.5rem)", lineHeight: 1.0, letterSpacing: -2, marginBottom: "1.2rem", animation: "slideUp .9s cubic-bezier(.16,1,.3,1) .4s both" }}>
        <Glitch>
          <span style={{ color: C.white }}>{name.out}{!name.done && <Cursor color={C.green} />}</span>
        </Glitch>
        <br />
        <span style={{ color: C.green, textShadow: `0 0 40px ${C.greenGlow}` }}>builds</span>{" "}
        {/* outline text — uses C.text so it's visible on both themes */}
        <span style={{ WebkitTextStroke: `2px ${C.text}`, color: "transparent" }}>real things.</span>
      </h1>

      {/* typewriter subtitle */}
      <div style={{ fontSize: ".82rem", color: C.cyan, letterSpacing: 2, minHeight: "1.4em", marginBottom: "2.5rem", animation: "slideUp .8s .7s both" }}>
        {name.done && <>{role.out}{!role.done && <Cursor color={C.cyan} />}</>}
      </div>

      {/* skill tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem", marginBottom: "2.8rem", animation: "slideUp .8s .9s both" }}>
        {["C / C++", "TypeScript", "NestJS", "Docker", "Linux", "REST APIs", "Full-Stack", "Systems"].map(tag => (
          <span key={tag}
            style={{ border: `1px solid ${C.border}`, padding: ".22rem .72rem", fontSize: ".64rem", color: C.cyan, letterSpacing: 1, background: C.greenDim, transition: "all .2s", cursor: "default" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.cyan; }}>
            {tag}
          </span>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", animation: "slideUp .8s 1.1s both" }}>
        <GlowBtn href="https://github.com/amarouf-dev" primary C={C}>GitHub Profile ↗</GlowBtn>
        <GlowBtn onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} C={C}>Get In Touch</GlowBtn>
      </div>

      {/* stats row */}
      <div className="stats-row" style={{ display: "flex", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, marginTop: "5rem", animation: "slideUp .8s 1.4s both" }}>
        {[
          { n: "4+", l: "Projects",   c: C.green },
          { n: "42", l: "Network",    c: C.cyan },
          { n: "2",  l: "Core Langs", c: C.orange },
          { n: "∞",  l: "Curiosity",  c: C.green },
        ].map((s, i, a) => (
          <div key={s.l} className="stat-item" style={{ flex: 1, padding: "1.6rem 1.8rem", borderRight: i < a.length - 1 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: s.c, lineHeight: 1, textShadow: `0 0 20px ${s.c}55` }}>{s.n}</div>
            <div style={{ fontSize: ".6rem", color: C.muted, letterSpacing: 2, marginTop: ".4rem", textTransform: "uppercase" }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* scroll cue */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".4rem", marginTop: "3rem", opacity: .45, animation: "fadeIn 1s 2.5s both" }}>
        <span style={{ fontSize: ".55rem", color: C.muted, letterSpacing: 3 }}>SCROLL</span>
        <div style={{ width: 1, height: 40, background: `linear-gradient(${C.green},transparent)`, animation: "pulse 2s infinite" }} />
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT SECTION
   ============================================================ */
function About({ C }) {
  return (
    <section id="about" className="pad" style={{ maxWidth: 980, margin: "0 auto", padding: "6rem 2.5rem", position: "relative", zIndex: 2 }}>
      <SectionHdr label="// About Me" sub="engineer · student · builder" C={C} />

      <div className="col-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>

        {/* terminal info card */}
        <Fade delay={0}>
          <TermWindow title="about.sh" glow C={C}>
            {[
              { k: "NAME",   v: "Abdallah Marouf",               c: C.white },
              { k: "ROLE",   v: "Software Engineer (Intern)",     c: C.cyan },
              { k: "SCHOOL", v: "1337 / 42 Network",             c: C.green },
              { k: "FOCUS",  v: "Full-Stack · Backend · Systems", c: C.text },
              { k: "STATUS", v: "🟢 Open to opportunities",       c: C.green },
            ].map(r => (
              <div key={r.k} style={{ display: "flex", gap: "1rem", marginBottom: ".1rem" }}>
                <span style={{ color: C.orange, minWidth: 72, fontSize: ".7rem" }}>{r.k}</span>
                <span style={{ color: C.muted }}>:</span>
                <span style={{ color: r.c, fontSize: ".76rem" }}>{r.v}</span>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${C.border}`, marginTop: ".8rem", paddingTop: ".8rem", color: C.muted, fontSize: ".7rem" }}>
              <span style={{ color: C.green }}># </span>learning: NestJS · advanced TS patterns
            </div>
          </TermWindow>
        </Fade>

        {/* bio text */}
        <Fade delay={180}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            <p style={{ fontSize: ".87rem", lineHeight: 1.9, color: C.text }}>
              I'm a student at <span style={{ color: C.green, fontWeight: 700 }}>1337 (42 Network)</span>, driven by deep curiosity about how systems work at their core — not just how to use them.
            </p>
            <p style={{ fontSize: ".87rem", lineHeight: 1.9, color: C.text }}>
              My projects go all the way down: 3D raycasting engines, Unix shells, containerized infrastructure, RFC-compliant network protocols. I build to understand.
            </p>
            <p style={{ fontSize: ".87rem", lineHeight: 1.9, color: C.text }}>
              Currently bridging systems knowledge with modern web dev — growing into <span style={{ color: C.cyan, fontWeight: 700 }}>TypeScript, NestJS, and REST API design</span>.
            </p>
            <div style={{ padding: ".9rem 1.1rem", border: `1px solid ${C.green}44`, background: C.greenDim, fontSize: ".7rem", color: C.green, letterSpacing: 1, marginTop: ".5rem", backdropFilter: "blur(8px)" }}>
              🟢 OPEN TO INTERNSHIP / FULL-TIME OPPORTUNITIES
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ============================================================
   PROJECTS SECTION
   ============================================================ */
const PROJECTS = [
  { num: "01", type: "GAME ENGINE", name: "Cube3D",       accent: "#ffb347", desc: "3D game engine in C using raycasting — textured walls, sprites, and smooth player movement inspired by Wolfenstein 3D.", stack: ["C", "Raycasting", "Graphics", "MLX42"], link: "https://github.com/amarouf-dev/cube3d" },
  { num: "02", type: "SYSTEMS",     name: "Minishell",    accent: "#00ff88", desc: "Fully functional Unix shell in C — lexer/parser, execution, pipes, redirections, heredocs and env variable expansion.", stack: ["C", "Unix", "Parsing", "Syscalls"],              link: "https://github.com/amarouf-dev/Minishell" },
  { num: "03", type: "DEVOPS",      name: "Inception",    accent: "#00e5ff", desc: "Production-grade containerized infra from scratch — Nginx, WordPress, MariaDB orchestrated with Docker Compose.", stack: ["Docker", "Nginx", "MariaDB", "Linux", "Make"], link: "https://github.com/amarouf-dev/Inception" },
  { num: "04", type: "NETWORKING",  name: "FT_IRC",       accent: "#ffb347", desc: "RFC 1459-compliant IRC server in C++ — raw sockets, multi-client event loop, channels, modes and operator commands.", stack: ["C++", "Sockets", "RFC 1459", "Networking"],      link: "https://github.com/amarouf-dev/ft_irc" },
  { num: "05", type: "COMING SOON", name: "Project Five", accent: "#555566", desc: "Something new is being built — check back soon.", stack: [], link: null, soon: true },
  { num: "06", type: "COMING SOON", name: "Project Six",  accent: "#555566", desc: "Something new is being built — check back soon.", stack: [], link: null, soon: true },
];

/* C is passed explicitly so this component has access to theme colors */
function ProjectCard({ p, index, C }) {
  const [hov, setHov] = useState(false);
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className="lift"
      onMouseEnter={() => !p.soon && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative", overflow: "hidden",
        background: C.surface,
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        border: `1px solid ${hov ? p.accent + "88" : C.border}`,
        padding: "2rem", cursor: p.soon ? "default" : "pointer",
        opacity: p.soon ? .3 : vis ? 1 : 0,
        transform: vis ? "none" : "translateY(24px)",
        transition: `opacity .65s ease ${index * 90}ms, transform .65s ease ${index * 90}ms, background .25s, border .25s, box-shadow .25s`,
        boxShadow: hov ? `0 8px 40px ${p.accent}33, inset 0 0 30px ${p.accent}0a` : "0 2px 12px rgba(0,0,0,0.2)",
      }}>

      {/* top accent sweep on hover */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: hov ? `linear-gradient(90deg,transparent,${p.accent},transparent)` : "transparent", transition: "background .3s" }} />
      {/* watermark number */}
      <div style={{ position: "absolute", bottom: "1rem", right: "1.2rem", fontSize: "4rem", fontWeight: 700, color: hov ? p.accent + "22" : C.border, lineHeight: 1, pointerEvents: "none", userSelect: "none", transition: "color .3s" }}>{p.num}</div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
        <span style={{ fontSize: ".6rem", color: C.muted }}>{p.num}</span>
        <span style={{ fontSize: ".6rem", color: hov ? p.accent : C.muted, border: `1px solid ${hov ? p.accent + "55" : C.border}`, padding: ".15rem .5rem", transition: "all .2s", letterSpacing: 1.5 }}>{p.type}</span>
      </div>
      <h3 style={{ fontSize: "1.35rem", fontWeight: 700, letterSpacing: -.5, marginBottom: ".75rem", color: hov ? p.accent : C.white, transition: "color .2s", textShadow: hov ? `0 0 25px ${p.accent}88` : "none" }}>{p.name}</h3>
      <p style={{ fontSize: ".76rem", color: C.text, lineHeight: 1.85, marginBottom: "1.4rem" }}>{p.desc}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: ".35rem", marginBottom: ".9rem" }}>
        {p.stack.map(s => <span key={s} style={{ fontSize: ".58rem", color: p.accent, background: p.accent + "18", border: `1px solid ${p.accent}30`, padding: ".18rem .5rem" }}>{s}</span>)}
      </div>
      {p.link && (
        <a href={p.link} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
          style={{ fontSize: ".62rem", color: hov ? p.accent : C.muted, textDecoration: "none", transition: "color .2s" }}>
          ↗ {p.link.replace("https://github.com/", "github.com/")}
        </a>
      )}
    </div>
  );
}

function Projects({ C }) {
  return (
    <section id="projects" className="pad" style={{ maxWidth: 980, margin: "0 auto", padding: "6rem 2.5rem", position: "relative", zIndex: 2 }}>
      <SectionHdr label="// Selected Projects" sub="hover to explore" C={C} />
      <div className="col-proj" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.border }}>
        {PROJECTS.map((p, i) => (
          /* pass C down so ProjectCard can use theme colors */
          <ProjectCard key={p.num} p={p} index={i} C={C} />
        ))}
      </div>
    </section>
  );
}

/* ============================================================
   SKILLS SECTION
   NOTE: SkillBar receives C as a prop — fixes the "C is not defined" bug
   ============================================================ */

/* C is passed so we can use C.border for the track background */
function SkillBar({ name, pct, color, index, C }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-14px)", transition: `all .7s cubic-bezier(.16,1,.3,1) ${index * 90}ms` }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".67rem", marginBottom: ".45rem" }}>
        <span style={{ color: C.text }}>{name}</span>
        <span style={{ color, textShadow: `0 0 10px ${color}88` }}>{pct}%</span>
      </div>
      {/* track uses C.border so it's visible on both light and dark */}
      <div style={{ height: 3, background: C.border, position: "relative", overflow: "hidden", borderRadius: 2 }}>
        <div style={{ position: "absolute", inset: 0, right: vis ? `${100 - pct}%` : "100%", background: `linear-gradient(90deg,${color},${color}66)`, boxShadow: `0 0 10px ${color}88`, transition: `right 1.4s cubic-bezier(.16,1,.3,1) ${index * 90 + 250}ms` }} />
      </div>
    </div>
  );
}

function Skills({ C }) {
  const categories = [
    { label: "Languages", items: ["C", "C++", "JavaScript", "TypeScript", "Bash"] },
    { label: "Backend",   items: ["NestJS", "REST APIs", "Node.js", "Express"] },
    { label: "DevOps",    items: ["Docker", "Docker Compose", "Linux", "Nginx", "Make"] },
    { label: "Concepts",  items: ["Raycasting", "Sockets", "RFC Protocols", "Containerization"] },
  ];

  /* skill bar colors — use fixed bright values so they pop on both themes */
  const BARS = [
    { name: "C / C++",                 pct: 85, color: "#ffb347" },
    { name: "JavaScript / TypeScript", pct: 72, color: "#00e5ff" },
    { name: "Docker / Linux",          pct: 80, color: "#00ff88" },
    { name: "NestJS / REST APIs",      pct: 65, color: "#00ff88" },
    { name: "Bash Scripting",          pct: 75, color: "#00e5ff" },
    { name: "Networking / Sockets",    pct: 70, color: "#ffb347" },
  ];

  return (
    <section id="skills" className="pad" style={{ maxWidth: 980, margin: "0 auto", padding: "6rem 2.5rem", position: "relative", zIndex: 2 }}>
      <SectionHdr label="// Skills & Stack" sub="always growing" C={C} />

      <div className="col-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>

        {/* JSON-style skill listing inside terminal window */}
        <Fade delay={0}>
          <TermWindow title="stack.json" C={C}>
            {categories.map((cat, i) => (
              <div key={cat.label} style={{ fontSize: ".75rem", lineHeight: 1.8 }}>
                <span style={{ color: C.orange }}>"{cat.label}"</span>
                <span style={{ color: C.text }}>: [</span>
                {cat.items.map((item, j) => (
                  <span key={item}>
                    <span style={{ color: C.cyan }}>"{item}"</span>
                    {j < cat.items.length - 1 && <span style={{ color: C.text }}>, </span>}
                  </span>
                ))}
                <span style={{ color: C.text }}>]{i < categories.length - 1 ? "," : ""}</span>
              </div>
            ))}
            <div style={{ marginTop: "1rem", fontSize: ".72rem", color: C.muted }}>
              <span style={{ color: C.green }}># </span>currently_learning: NestJS · TS patterns
            </div>
          </TermWindow>
        </Fade>

        {/* animated progress bars — C is passed down to each SkillBar */}
        <Fade delay={200}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {BARS.map((b, i) => (
              <SkillBar key={b.name} {...b} index={i} C={C} />
            ))}
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ============================================================
   INTERACTIVE TERMINAL WIDGET
   ============================================================ */
const TERMINAL_CMDS = {
  help:     [{ c: "#00e5ff", v: "Commands: whoami · skills · projects · contact · repo · clear" }],
  whoami:   [{ c: "#ffffff", v: "Abdallah Marouf — Student @ 1337 / 42 Network" }, { c: "#00ff88", v: "Focus: Full-Stack · Backend · Systems  |  🟢 Open to work" }],
  skills:   [{ c: "#ffb347", v: "C, C++, JavaScript, TypeScript, Bash" }, { c: "#ffb347", v: "NestJS, REST APIs, Node.js · Docker, Linux, Nginx" }],
  projects: [{ c: "#00e5ff", v: "[01] Cube3D   — 3D raycasting engine in C" }, { c: "#00e5ff", v: "[02] Minishell — Unix shell in C" }, { c: "#00e5ff", v: "[03] Inception — Dockerized infra" }, { c: "#00e5ff", v: "[04] FT_IRC   — RFC-compliant IRC server in C++" }],
  contact:  [{ c: "#00ff88", v: "GitHub : github.com/amarouf-dev" }, { c: "#00ff88", v: "School : 1337 / 42 Network" }],
  repo:     [{ c: "#00e5ff", v: "Opening GitHub profile..." }],
};

function LiveTerminal({ C }) {
  const [history, setHistory] = useState([{ t: "sys", v: "Type 'help' for available commands." }]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history]);

  const run = useCallback((raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const next = [...history, { t: "prompt", v: cmd }];
    if (cmd === "clear") { setHistory([]); setCmdHistory(p => [cmd, ...p]); setHistIdx(-1); return; }
    if (cmd === "repo") window.open("https://github.com/amarouf-dev", "_blank");
    const res = TERMINAL_CMDS[cmd];
    if (res) res.forEach(r => next.push({ t: r.c, v: r.v }));
    else next.push({ t: C.red, v: `command not found: '${cmd}' — try 'help'` });
    setHistory(next);
    setCmdHistory(p => [cmd, ...p]);
    setHistIdx(-1);
  }, [history, C.red]);

  const handleKey = (e) => {
    if (e.key === "Enter")      { run(input); setInput(""); }
    else if (e.key === "ArrowUp")   { const i = Math.min(histIdx + 1, cmdHistory.length - 1); setHistIdx(i); setInput(cmdHistory[i] || ""); }
    else if (e.key === "ArrowDown") { const i = Math.max(histIdx - 1, -1); setHistIdx(i); setInput(i < 0 ? "" : cmdHistory[i] || ""); }
  };

  return (
    <div style={{ border: `1px solid ${C.green}66`, background: C.surface, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: `0 0 50px ${C.greenGlow}` }}>
      <div style={{ background: C.surface2, padding: ".5rem 1rem", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: ".4rem" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: .85 }} />)}
        <span style={{ fontSize: ".58rem", color: C.muted, marginLeft: ".5rem" }}>interactive — bash</span>
        <span style={{ marginLeft: "auto", fontSize: ".58rem", color: C.green, animation: "pulse 2s infinite" }}>● live</span>
      </div>
      <div style={{ padding: "1rem 1.4rem", fontFamily: FONT, fontSize: ".74rem", lineHeight: 1.95, maxHeight: 260, overflowY: "auto" }}>
        {history.map((h, i) => (
          <div key={i} style={{ color: h.t === "sys" ? C.muted : h.t === "prompt" ? C.white : h.t }}>
            {h.t === "prompt" && <span style={{ color: C.green }}>~ $ </span>}
            {h.v}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: C.green }}>~ $ </span>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            style={{ background: "transparent", border: "none", outline: "none", fontFamily: FONT, fontSize: ".74rem", color: C.white, flex: 1, marginLeft: 6, caretColor: C.green }}
            placeholder="type a command..." autoFocus />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

/* ============================================================
   CONTACT SECTION
   ============================================================ */
function Contact({ C }) {
  const [copied, setCopied] = useState(false);
  const email = "abdellahmarof@gmail.com";

  return (
    <section id="contact" className="pad" style={{ maxWidth: 980, margin: "0 auto", padding: "6rem 2.5rem 8rem", position: "relative", zIndex: 2 }}>
      <SectionHdr label="// Get In Touch" sub="let's build something" C={C} />

      <div className="col-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>

        <Fade delay={0}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <p style={{ fontSize: ".88rem", color: C.text, lineHeight: 1.9 }}>
              Actively looking for <span style={{ color: C.green, fontWeight: 700 }}>internship roles</span> where I can contribute, grow fast, and ship real software. If you're building something interesting — let's talk.
            </p>
            {[
              { icon: "⌨", label: "GitHub", value: "github.com/amarouf-dev", href: "https://github.com/amarouf-dev" },
              { icon: "🏫", label: "School", value: "1337 / 42 Network" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: ".65rem .9rem", border: `1px solid ${C.border}`, background: C.surface, backdropFilter: "blur(8px)" }}>
                <span style={{ fontSize: ".7rem", color: C.text, minWidth: 64, fontWeight: 700 }}>{r.icon} {r.label}</span>
                {r.href
                  ? <a href={r.href} target="_blank" rel="noreferrer" style={{ fontSize: ".76rem", color: C.cyan, textDecoration: "none" }}>{r.value}</a>
                  : <span style={{ fontSize: ".76rem", color: C.text }}>{r.value}</span>}
              </div>
            ))}
            {/* email row with copy button */}
            <div style={{ display: "flex", alignItems: "center", gap: ".8rem", padding: ".65rem .9rem", border: `1px solid ${C.border}`, background: C.surface, backdropFilter: "blur(8px)" }}>
              <span style={{ fontSize: ".7rem", color: C.text, minWidth: 64, fontWeight: 700 }}>✉ Email</span>
              <span style={{ fontSize: ".72rem", color: C.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</span>
              <button onClick={() => { navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2500); }}
                style={{ background: copied ? C.greenDim : "transparent", border: `1px solid ${copied ? C.green : C.border}`, color: copied ? C.green : C.muted, fontFamily: FONT, fontSize: ".58rem", letterSpacing: 1, padding: ".2rem .6rem", cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}>
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <GlowBtn href="https://github.com/amarouf-dev" primary C={C}>View GitHub ↗</GlowBtn>
          </div>
        </Fade>

        <Fade delay={200}>
          <div>
            <div style={{ fontSize: ".6rem", color: C.muted, letterSpacing: 2, marginBottom: ".7rem", textTransform: "uppercase" }}>// try the interactive terminal</div>
            <LiveTerminal C={C} />
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ C }) {
  return (
    <footer style={{ borderTop: `1px solid ${C.border}`, padding: "1.5rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: ".8rem", position: "relative", zIndex: 2, background: C.surface, backdropFilter: "blur(12px)" }}>
      <span style={{ fontSize: ".58rem", color: C.muted, letterSpacing: 2 }}>&lt;/&gt; ABDALLAH MAROUF · 2025</span>
      <span style={{ fontSize: ".58rem", color: C.green, letterSpacing: 2, display: "flex", alignItems: "center", gap: ".4rem" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, display: "inline-block", animation: "pulse 2s infinite" }} />ONLINE
      </span>
      <span style={{ fontSize: ".58rem", color: C.muted, letterSpacing: 2 }}>OPEN TO OPPORTUNITIES</span>
    </footer>
  );
}

/* ============================================================
   APP — root
   - owns theme state
   - tracks active section via IntersectionObserver
   - single scrollable page
   ============================================================ */
const SECTION_IDS = ["home", "about", "projects", "skills", "contact"];

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [activeSection, setActiveSection] = useState("home");
  const C = THEMES[theme]; // active color palette

  // update global CSS when theme changes
  useEffect(() => {
    let el = document.getElementById("portfolio-css");
    if (!el) { el = document.createElement("style"); el.id = "portfolio-css"; document.head.appendChild(el); }
    el.textContent = makeCSS(C);
  }, [C]);

  // highlight nav link matching the section currently in view
  useEffect(() => {
    const observers = SECTION_IDS.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    }).filter(Boolean);
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT, minHeight: "100vh", transition: "background .4s, color .4s" }}>
      <Particles C={C} />
      <Scanlines C={C} />
      <Nav active={activeSection} theme={theme} toggleTheme={toggleTheme} C={C} />

      <main>
        <Home C={C} />
        <Divider C={C} />
        <About C={C} />
        <Divider C={C} />
        <Projects C={C} />
        <Divider C={C} />
        <Skills C={C} />
        <Divider C={C} />
        <Contact C={C} />
      </main>

      <Footer C={C} />
    </div>
  );
}
