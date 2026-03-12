import { useState, useEffect, useRef } from "react";

/* types `text` char by char after `delay` ms */
export function useTypewriter(text, speed = 40, delay = 0) {
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
export function useReveal(threshold = 0.12) {
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
