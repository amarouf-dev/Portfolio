import { useState, useEffect, useRef, useCallback } from "react";
import { FONT } from "../theme";
import { SectionHdr, Fade, GlowBtn } from "./Shared";

/* ============================================================
   INTERACTIVE TERMINAL WIDGET
   ============================================================ */
const TERMINAL_CMDS = {
    help: [{ c: "#00e5ff", v: "Commands: whoami · skills · projects · contact · repo · clear" }],
    whoami: [{ c: "#ffffff", v: "Abdallah Marouf — Student @ 1337 / 42 Network" }, { c: "#00ff88", v: "Focus: Full-Stack · Backend · Systems  |  🟢 Open to work" }],
    skills: [{ c: "#ffb347", v: "C, C++, JavaScript, TypeScript, Bash" }, { c: "#ffb347", v: "NestJS, REST APIs, Node.js · Docker, Linux, Nginx" }],
    projects: [{ c: "#00e5ff", v: "[01] Cube3D   — 3D raycasting engine in C" }, { c: "#00e5ff", v: "[02] Minishell — Unix shell in C" }, { c: "#00e5ff", v: "[03] Inception — Dockerized infra" }, { c: "#00e5ff", v: "[04] FT_IRC   — RFC-compliant IRC server in C++" }],
    contact: [{ c: "#00ff88", v: "GitHub : github.com/amarouf-dev" }, { c: "#00ff88", v: "School : 1337 / 42 Network" }],
    repo: [{ c: "#00e5ff", v: "Opening GitHub profile..." }],
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
        if (e.key === "Enter") { run(input); setInput(""); }
        else if (e.key === "ArrowUp") { const i = Math.min(histIdx + 1, cmdHistory.length - 1); setHistIdx(i); setInput(cmdHistory[i] || ""); }
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
export default function Contact({ C }) {
    const [copied, setCopied] = useState(false);
    const email = "abdallah.marouf@student.1337.ma";

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
