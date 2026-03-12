export default function Footer({ C }) {
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
