import { SectionHdr, Fade, TermWindow } from "./Shared";

export default function About({ C }) {
    return (
        <section id="about" className="pad" style={{ maxWidth: 980, margin: "0 auto", padding: "6rem 2.5rem", position: "relative", zIndex: 2 }}>
            <SectionHdr label="// About Me" sub="engineer · student · builder" C={C} />

            <div className="col-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>

                {/* terminal info card */}
                <Fade delay={0}>
                    <TermWindow title="about.sh" glow C={C}>
                        {[
                            { k: "NAME", v: "Abdallah Marouf", c: C.white },
                            { k: "ROLE", v: "Software Engineer (Intern)", c: C.cyan },
                            { k: "SCHOOL", v: "1337 / 42 Network", c: C.green },
                            { k: "FOCUS", v: "Full-Stack · Backend · Systems", c: C.text },
                            { k: "STATUS", v: "🟢 Open to opportunities", c: C.green },
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
