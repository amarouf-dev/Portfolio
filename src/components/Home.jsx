import { FONT } from "../theme";
import { useTypewriter } from "../hooks";
import { Cursor, GlowBtn } from "./Shared";
import { Glitch } from "./Background";

export default function Home({ C }) {
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
                <a href="/cv.pdf" download style={{
                    padding: ".62rem 1.5rem", fontFamily: "'JetBrains Mono','Fira Code','Courier New',monospace",
                    fontSize: ".72rem", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
                    cursor: "pointer", textDecoration: "none", display: "inline-block", transition: "all .2s",
                    background: "transparent", color: C.text, border: `1px solid ${C.border}`,
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.green; e.currentTarget.style.color = C.green; e.currentTarget.style.boxShadow = `0 0 18px ${C.greenGlow}`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.text; e.currentTarget.style.boxShadow = "none"; }}
                >⬇ Download CV</a>
            </div>

            {/* stats row */}
            <div className="stats-row" style={{ display: "flex", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, marginTop: "5rem", animation: "slideUp .8s 1.4s both" }}>
                {[
                    { n: "4+", l: "Projects", c: C.green },
                    { n: "42", l: "Network", c: C.cyan },
                    { n: "2", l: "Core Langs", c: C.orange },
                    { n: "∞", l: "Curiosity", c: C.green },
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
