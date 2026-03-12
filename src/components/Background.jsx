import { useState, useEffect, useRef } from "react";

/* animated particle network — mouse-reactive — requires C prop */
export function Particles({ C }) {
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
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
                if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
                const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
                if (d < 90) { p.x += (p.x - mouse.x) * .014; p.y += (p.y - mouse.y) * .014; }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = C.green + "99";
                ctx.fill();
            });

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
    }, [C.green]);

    return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* CRT scanline overlay + moving sweep line */
export function Scanlines({ C }) {
    return (
        <>
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 997, background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.02) 2px,rgba(0,0,0,0.02) 4px)" }} />
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,transparent,${C.green}55,transparent)`, pointerEvents: "none", zIndex: 998, animation: "scanMove 10s linear infinite" }} />
        </>
    );
}

/* chromatic-aberration glitch on name text */
export function Glitch({ children }) {
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
