import { useState } from "react";
import { useReveal } from "../hooks";
import { SectionHdr } from "./Shared";

const PROJECTS = [
    { num: "01", type: "GAME ENGINE", name: "Cube3D", accent: "#ffb347", desc: "3D game engine in C using raycasting — textured walls, sprites, and smooth player movement inspired by Wolfenstein 3D.", stack: ["C", "Raycasting", "Graphics", "MLX42"], link: "https://github.com/amarouf-dev/cube3d" },
    { num: "02", type: "SYSTEMS", name: "Minishell", accent: "#00ff88", desc: "Fully functional Unix shell in C — lexer/parser, execution, pipes, redirections, heredocs and env variable expansion.", stack: ["C", "Unix", "Parsing", "Syscalls"], link: "https://github.com/amarouf-dev/Minishell" },
    { num: "03", type: "DEVOPS", name: "Inception", accent: "#00e5ff", desc: "Production-grade containerized infra from scratch — Nginx, WordPress, MariaDB orchestrated with Docker Compose.", stack: ["Docker", "Nginx", "MariaDB", "Linux", "Make"], link: "https://github.com/amarouf-dev/Inception" },
    { num: "04", type: "NETWORKING", name: "FT_IRC", accent: "#ffb347", desc: "RFC 1459-compliant IRC server in C++ — raw sockets, multi-client event loop, channels, modes and operator commands.", stack: ["C++", "Sockets", "RFC 1459", "Networking"], link: "https://github.com/amarouf-dev/ft_irc" },
    { num: "05", type: "COMING SOON", name: "Project Five", accent: "#555566", desc: "Something new is being built — check back soon.", stack: [], link: null, soon: true },
    { num: "06", type: "COMING SOON", name: "Project Six", accent: "#555566", desc: "Something new is being built — check back soon.", stack: [], link: null, soon: true },
];

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

export default function Projects({ C }) {
    return (
        <section id="projects" className="pad" style={{ maxWidth: 980, margin: "0 auto", padding: "6rem 2.5rem", position: "relative", zIndex: 2 }}>
            <SectionHdr label="// Selected Projects" sub="hover to explore" C={C} />
            <div className="col-proj" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.border }}>
                {PROJECTS.map((p, i) => (
                    <ProjectCard key={p.num} p={p} index={i} C={C} />
                ))}
            </div>
        </section>
    );
}
