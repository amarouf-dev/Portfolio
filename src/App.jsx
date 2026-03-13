import { useState, useEffect } from "react";
import { THEMES, FONT, makeCSS } from "./theme";
import { Particles, Scanlines } from "./components/Background";
import Nav from "./components/Nav";
import Home from "./components/Home";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { Divider } from "./components/Shared";

const SECTION_IDS = ["home", "about", "projects", "skills", "contact"];

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const C = THEMES.dark;

  // update global CSS when theme changes
  useEffect(() => {
    let el = document.getElementById("portfolio-css");
    if (!el) { el = document.createElement("style"); el.id = "portfolio-css"; document.head.appendChild(el); }
    el.textContent = makeCSS(C);
  }, [C]);

  // highlight nav link matching the section currently in view
  useEffect(() => {
    const observers = SECTION_IDS.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    }).filter(Boolean);
    return () => observers.forEach(o => o.disconnect());
  }, []);

  // scroll to top on initial load
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: FONT, minHeight: "100vh", transition: "background .4s, color .4s" }}>
      <Particles C={C} />
      <Scanlines C={C} />
      <Nav active={activeSection} C={C} />

      <main>
        <Home C={C} />
        <Divider C={C} />
        <About C={C} />
        <Divider C={C} />
        <Projects C={C} />
        <Divider C={C} />
        <Skills C={C} />
        <Divider C={C} />
        <Contact C={C} />
      </main>

      <Footer C={C} />
    </div>
  );
}
