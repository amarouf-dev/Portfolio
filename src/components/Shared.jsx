import { useState, useEffect } from "react";
import { useReveal } from "../hooks";
import { FONT } from "../theme";

/* blinking block cursor */
export function Cursor({ color }) {
    const [on, setOn] = useState(true);
    useEffect(() => { const iv = setInterval(() => setOn(v => !v), 520); return () => clearInterval(iv); }, []);
    return (
        <span style={{ display: "inline-block", width: 9, height: "1.1em", background: on ? color : "transparent", verticalAlign: "middle", marginLeft: 2 }} />
    );
}

/* fade + slide up on scroll into view */
export function Fade({ children, delay = 0 }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: `all .75s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
            {children}
        </div>
    );
}

/* button or link with glow — requires C prop */
export function GlowBtn({ children, href, primary, onClick, C }) {
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
export function TermWindow({ title, children, glow, C }) {
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
export function Divider({ C }) {
    return (
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 2.5rem" }}>
            <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${C.border},transparent)` }} />
        </div>
    );
}

/* section label + decorative line — requires C prop */
export function SectionHdr({ label, sub, C }) {
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
