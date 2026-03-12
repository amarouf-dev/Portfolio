import { useReveal } from "../hooks";
import { SectionHdr, Fade, TermWindow } from "./Shared";

function SkillBar({ name, pct, color, index, C }) {
    const [ref, vis] = useReveal();
    return (
        <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateX(-14px)", transition: `all .7s cubic-bezier(.16,1,.3,1) ${index * 90}ms` }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".67rem", marginBottom: ".45rem" }}>
                <span style={{ color: C.text }}>{name}</span>
                <span style={{ color, textShadow: `0 0 10px ${color}88` }}>{pct}%</span>
            </div>
            <div style={{ height: 3, background: C.border, position: "relative", overflow: "hidden", borderRadius: 2 }}>
                <div style={{ position: "absolute", inset: 0, right: vis ? `${100 - pct}%` : "100%", background: `linear-gradient(90deg,${color},${color}66)`, boxShadow: `0 0 10px ${color}88`, transition: `right 1.4s cubic-bezier(.16,1,.3,1) ${index * 90 + 250}ms` }} />
            </div>
        </div>
    );
}

export default function Skills({ C }) {
    const categories = [
        { label: "Languages", items: ["C", "C++", "JavaScript", "TypeScript", "Bash"] },
        { label: "Backend", items: ["NestJS", "REST APIs", "Node.js", "Express"] },
        { label: "DevOps", items: ["Docker", "Docker Compose", "Linux", "Nginx", "Make"] },
        { label: "Concepts", items: ["Raycasting", "Sockets", "RFC Protocols", "Containerization"] },
    ];

    const BARS = [
        { name: "C / C++", pct: 85, color: "#ffb347" },
        { name: "JavaScript / TypeScript", pct: 72, color: "#00e5ff" },
        { name: "Docker / Linux", pct: 80, color: "#00ff88" },
        { name: "NestJS / REST APIs", pct: 65, color: "#00ff88" },
        { name: "Bash Scripting", pct: 75, color: "#00e5ff" },
        { name: "Networking / Sockets", pct: 70, color: "#ffb347" },
    ];

    return (
        <section id="skills" className="pad" style={{ maxWidth: 980, margin: "0 auto", padding: "6rem 2.5rem", position: "relative", zIndex: 2 }}>
            <SectionHdr label="// Skills & Stack" sub="always growing" C={C} />

            <div className="col-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>

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
