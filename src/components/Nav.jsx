import { useState, useEffect } from "react";
import { FONT } from "../theme";

const NAV_LINKS = ["home", "about", "projects", "skills", "contact"];

export default function Nav({ active, C }) {
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

    const navBg = scrolled ? "rgba(6,6,8,0.96)" : "transparent";

    return (
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, padding: ".8rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: navBg, borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`, backdropFilter: scrolled ? "blur(16px)" : "none", transition: "all .4s" }}>

            {/* logo */}
            <div onClick={() => scrollTo("home")} style={{ color: C.green, fontWeight: 700, fontSize: "1rem", letterSpacing: 3, cursor: "pointer", textShadow: `0 0 20px ${C.greenGlow}` }}>
                AM<span style={{ color: C.muted }}>_</span>DEV
            </div>

            {/* desktop: nav links */}
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
            </div>

            {/* mobile: hamburger */}
            <button onClick={() => setMenuOpen(v => !v)} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.green, fontFamily: FONT, fontSize: ".75rem", padding: ".3rem .8rem", cursor: "pointer", display: "none" }} className="show-mob">☰</button>

            {/* mobile fullscreen menu */}
            {menuOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(6,6,8,.97)", zIndex: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
                    <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "transparent", border: "none", color: C.muted, fontSize: "1.5rem", cursor: "pointer" }}>✕</button>
                    {NAV_LINKS.map(l => (
                        <button key={l} onClick={() => scrollTo(l)} style={{ background: "transparent", border: "none", color: active === l ? C.green : C.text, fontFamily: FONT, fontSize: "1.5rem", letterSpacing: 4, cursor: "pointer" }}>./{l}</button>
                    ))}
                </div>
            )}
        </nav>
    );
}
