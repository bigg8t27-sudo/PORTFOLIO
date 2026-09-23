import { useEffect, useState, useCallback } from "react";
import { Menu, X, ArrowDown, ArrowRight, ExternalLink, Mail, Link, Phone, Sun, Moon } from "lucide-react";
import Lenis from "@studio-freight/lenis";
import { Lightning } from "./Lightning";
import { LogoWordmark } from "./Logo";
import { PageTransition } from "./components/PageTransition";
import { IntroScreen } from "./components/IntroScreen";

const projects = [
  { id: 1, title: "Student Performance Analytics", description: "Data analysis system for tracking and visualizing student performance metrics.", technologies: ["Python", "Pandas", "SQL", "Statistics", "Data Visualization"], github: "https://github.com/bigg8t27-sudo", demo: "https://example.com" },
  { id: 2, title: "AI Study Assistant", description: "Intelligent study companion powered by AI with personalized recommendations.", technologies: ["Python", "AI", "React", "APIs", "Machine Learning"], github: "https://github.com/bigg8t27-sudo", demo: "https://example.com" },
  { id: 3, title: "Personal Finance Dashboard", description: "Modern web app for tracking expenses, budgets and financial goals.", technologies: ["React", "TypeScript", "APIs", "Tailwind CSS"], github: "https://github.com/bigg8t27-sudo", demo: "https://example.com" },
  { id: 4, title: "Church Event Management", description: "Full-stack system for managing church events and member communication.", technologies: ["React", "Node.js", "PostgreSQL", "TypeScript"], github: "https://github.com/bigg8t27-sudo", demo: "https://example.com" },
  { id: 5, title: "Data Exploration Project", description: "Statistical analysis and visualization of complex datasets.", technologies: ["Python", "Statistics", "Matplotlib", "NumPy", "Pandas"], github: "https://github.com/bigg8t27-sudo", demo: "https://example.com" },
];
const skillGroups = [
  { category: "Languages", items: ["Python", "C++", "JavaScript", "TypeScript", "SQL"] },
  { category: "Frameworks", items: ["React", "Node.js", "Tailwind CSS", "GSAP"] },
  { category: "Data", items: ["Pandas", "NumPy", "Matplotlib", "Statistics", "SQL"] },
  { category: "Tools", items: ["Git", "GitHub", "VS Code", "Figma", "Linux"] },
];
const timeline = [
  { year: "2026", title: "Data Science & Analytics", description: "Ghana Communication Technology University" },
  { year: "2025", title: "Software Development", description: "Started developing software projects and learning modern web technologies." },
  { year: "2025", title: "Data Analytics", description: "Started exploring Python, statistics, data analysis and visualization." },
  { year: "2024", title: "Programming", description: "Started building programming fundamentals and computer science concepts." },
];
const contacts = [
  { label: "EMAIL", text: "alfred@example.com", href: "mailto:alfred@example.com", isPhone: false },
  { label: "PHONE", text: "0597 580 576", href: "tel:+233597580576", isPhone: true },
  { label: "PHONE 2", text: "0598 942 192", href: "tel:+233598942192", isPhone: true },
  { label: "LINKEDIN", text: "linkedin.com/in/alfredofori", href: "https://linkedin.com/in/alfredofori", isPhone: false },
  { label: "GITHUB", text: "github.com/bigg8t27-sudo", href: "https://github.com/bigg8t27-sudo", isPhone: false },
];

// ── Theme tokens ──────────────────────────────────────────────────────────────
type Theme = "dark" | "light";

function getTokens(theme: Theme) {
  const dark = theme === "dark";
  return {
    bg:           dark ? "#050505" : "#F5F7FA",
    bgNav:        dark ? "rgba(5,5,5,0.92)"   : "rgba(245,247,250,0.92)",
    bgOverlay:    dark ? "rgba(5,5,5,0.97)"   : "rgba(245,247,250,0.97)",
    bgSection:    dark ? "transparent"         : "transparent",
    bgCard:       dark ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.8)",
    bgInput:      dark ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)",
    bgFooter:     dark ? "rgba(8,8,8,0.75)"   : "rgba(230,233,240,0.9)",
    text:         dark ? "#F5F5F5"             : "#0A0A0A",
    textMuted:    dark ? "#8A8A8A"             : "#555555",
    accent:       "#00B4D8",
    accentGlow:   dark ? "#00E5FF"             : "#0096B4",
    border:       dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    borderAccent: dark ? "rgba(0,229,255,0.15)"  : "rgba(0,150,180,0.2)",
    navBorder:    dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
    gridColor:    dark ? "rgba(0,229,255,0.03)"   : "rgba(0,150,180,0.04)",
    statBorder:   dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
    tagBg:        dark ? "rgba(0,229,255,0.06)"   : "rgba(0,150,180,0.08)",
    dotBg:        dark ? "rgba(0,229,255,0.4)"    : "rgba(0,150,180,0.5)",
    hoverTextCSS: dark ? "#00E5FF" : "#0096B4",
    hoverGlow:    dark ? "0 0 18px rgba(0,229,255,0.35)" : "0 0 12px rgba(0,150,180,0.25)",
    cardHoverBorder: dark ? "rgba(0,229,255,0.3)" : "rgba(0,150,180,0.35)",
    bracketColor: dark ? "rgba(0,229,255,0.4)"    : "rgba(0,150,180,0.45)",
    scrollTrack:  dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)",
  };
}

// ── Scroll Progress Bar ────────────────────────────────────────────────────────
function ScrollProgressBar({ pct, accent }: { pct: number; accent: string }) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2, zIndex: 100, pointerEvents: "none" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${accent}, ${accent}66)`, boxShadow: `0 0 8px ${accent}cc`, transition: "width 0.1s linear" }} />
    </div>
  );
}

// ── LitSection ────────────────────────────────────────────────────────────────
function LitSection({ id, children, style = {}, theme }: { id?: string; children: React.ReactNode; style?: React.CSSProperties; theme: Theme }) {
  const [intensity, setIntensity] = useState(0.03);
  const boost = useCallback(() => { setIntensity(0.14); setTimeout(() => setIntensity(0.03), 600); }, []);
  return (
    <div id={id} style={{ position: "relative", overflow: "hidden", ...style }} onMouseOver={boost}>
      {theme === "dark" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          <Lightning hue={195} speed={0.5} intensity={intensity} size={0.9} />
        </div>
      )}
      {theme === "light" && (
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(ellipse at 80% 50%, rgba(0,180,216,0.04) 0%, transparent 60%)",
        }} />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ── Theme Toggle Button ────────────────────────────────────────────────────────
function ThemeToggle({ theme, toggle, t }: { theme: Theme; toggle: () => void; t: ReturnType<typeof getTokens> }) {
  return (
    <button
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 36, height: 36, borderRadius: "50%",
        border: `1px solid ${t.borderAccent}`,
        background: theme === "dark" ? "rgba(0,229,255,0.06)" : "rgba(0,150,180,0.08)",
        color: t.accentGlow, cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [introComplete, setIntroComplete] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const t = getTokens(theme);
  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  useEffect(() => {
    try {
      const lenis = new Lenis({ duration: 1.2, easing: (v: number) => Math.min(1, 1.001 - Math.pow(2, -10 * v)) });
      function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      return () => lenis.destroy();
    } catch (_e) {}
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setFormError("");
    if (!form.name.trim()) { setFormError("Name is required"); return; }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) { setFormError("Valid email is required"); return; }
    if (!form.message.trim()) { setFormError("Message is required"); return; }
    setSubmitted(true); setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const navLinks = [
    { label: "WORK", href: "#work" }, { label: "ABOUT", href: "#about" },
    { label: "STACK", href: "#stack" }, { label: "CONTACT", href: "#contact" },
  ];

  // Shared style shortcuts
  const heading: React.CSSProperties = { fontFamily: "Space Grotesk, sans-serif", fontWeight: 700 };
  const section: React.CSSProperties = { padding: "5rem 1.5rem", maxWidth: "1280px", margin: "0 auto" };
  const sectionNum: React.CSSProperties = { ...heading, fontSize: "1.5rem", color: t.accentGlow, opacity: 0.5 };
  const sectionTitle: React.CSSProperties = { ...heading, fontSize: "clamp(2rem,5vw,3.5rem)", margin: 0, color: t.text };
  const label: React.CSSProperties = { fontSize: "0.68rem", ...heading, color: t.accentGlow, letterSpacing: "0.15em", marginBottom: "0.75rem", display: "block" };
  const muted: React.CSSProperties = { color: t.textMuted };
  const dot: React.CSSProperties = { width: 8, height: 8, borderRadius: "50%", backgroundColor: t.accentGlow, display: "inline-block", boxShadow: `0 0 6px ${t.accentGlow}` };
  const btn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", backgroundColor: t.accentGlow, color: theme === "dark" ? "#050505" : "#fff", ...heading, borderRadius: "0.375rem", textDecoration: "none", fontSize: "0.875rem", border: "none", cursor: "pointer", letterSpacing: "0.05em" };
  const btnOutline: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem", border: `1px solid ${t.accentGlow}99`, color: t.accentGlow, ...heading, borderRadius: "0.375rem", textDecoration: "none", fontSize: "0.875rem", background: "none", letterSpacing: "0.05em", cursor: "pointer" };
  const card: React.CSSProperties = { padding: "2rem", border: `1px solid ${t.border}`, borderRadius: "0.5rem", position: "relative", background: t.bgCard, backdropFilter: theme === "light" ? "blur(8px)" : "none" };
  const tag: React.CSSProperties = { padding: "0.2rem 0.65rem", background: t.tagBg, border: `1px solid ${t.borderAccent}`, borderRadius: "0.25rem", fontSize: "0.75rem", color: t.textMuted, letterSpacing: "0.03em" };
  const input: React.CSSProperties = { width: "100%", padding: "0.75rem 1rem", background: t.bgInput, border: `1px solid ${t.border}`, borderRadius: "0.375rem", color: t.text, fontSize: "0.9375rem", boxSizing: "border-box", fontFamily: "Inter, sans-serif", outline: "none" };

  return (
    <div style={{ backgroundColor: t.bg, color: t.text, fontFamily: "Inter, sans-serif", transition: "background-color 0.3s, color 0.3s", minHeight: "100vh" }}>
      {/* ── Intro boot screen — shows once before portfolio ── */}
      {!introComplete && (
        <IntroScreen accent="#00E5FF" onComplete={() => setIntroComplete(true)} />
      )}
      <style>{`        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        html { scroll-behavior: smooth; }
        a { transition: color 0.2s; }
        .nav-desktop { display: none; }
        .nav-mobile { display: flex; }
        @media(min-width: 768px) { .nav-desktop { display: block; } .nav-mobile { display: none; } }
        @media(prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
        .hover-text { transition: color 0.2s, text-shadow 0.3s; }
        .dark-mode .hover-text:hover  { color: #00E5FF !important; text-shadow: 0 0 18px rgba(0,229,255,0.35); }
        .light-mode .hover-text:hover { color: #0096B4 !important; text-shadow: 0 0 12px rgba(0,150,180,0.25); }
        .dark-mode .card-hover:hover  { border-color: rgba(0,229,255,0.3) !important; box-shadow: 0 0 24px rgba(0,229,255,0.05); }
        .light-mode .card-hover:hover { border-color: rgba(0,150,180,0.4) !important; box-shadow: 0 4px 24px rgba(0,150,180,0.1); }
        .dark-mode .btn-glow:hover  { box-shadow: 0 0 20px rgba(0,229,255,0.35); }
        .light-mode .btn-glow:hover { box-shadow: 0 4px 16px rgba(0,150,180,0.3); }
        .dark-mode .tag-hover:hover  { border-color: rgba(0,229,255,0.5) !important; color: #00E5FF !important; }
        .light-mode .tag-hover:hover { border-color: rgba(0,150,180,0.6) !important; color: #0096B4 !important; }
        .card-hover { transition: border-color 0.25s, box-shadow 0.25s; }
        .theme-btn:hover { opacity: 0.8; transform: scale(1.05); }
        ::selection { background: rgba(0,180,216,0.25); color: #fff; }
      `}</style>

      <div className={theme === "dark" ? "dark-mode" : "light-mode"}>
        <PageTransition accent="#00E5FF" duration={1800} />
        <ScrollProgressBar pct={scrollPct} accent={t.accentGlow} />

        {/* ── Desktop Nav ── */}
        <nav className="nav-desktop" style={{ position: "fixed", top: 2, left: 0, right: 0, zIndex: 50, transition: "all 0.3s", backgroundColor: isScrolled ? t.bgNav : "transparent", backdropFilter: isScrolled ? "blur(16px)" : "none", borderBottom: isScrolled ? `1px solid ${t.navBorder}` : "none" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <a href="/" style={{ textDecoration: "none" }}><LogoWordmark size={32} /></a>
            <ul style={{ display: "flex", gap: "2rem", listStyle: "none" }}>
              {navLinks.map(l => (
                <li key={l.href}>
                  <a href={l.href} className="hover-text" style={{ color: t.textMuted, textDecoration: "none", fontSize: "0.8rem", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, letterSpacing: "0.08em" }}>{l.label}</a>
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: t.textMuted, fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, letterSpacing: "0.1em", border: `1px solid ${t.borderAccent}`, padding: "0.3rem 0.75rem", borderRadius: "2rem" }}>
                <span style={dot}></span> AVAILABLE
              </div>
              <ThemeToggle theme={theme} toggle={toggleTheme} t={t} />
            </div>
          </div>
        </nav>

        {/* ── Mobile Nav ── */}
        <nav className="nav-mobile" style={{ position: "fixed", top: 2, left: 0, right: 0, zIndex: 50, alignItems: "center", justifyContent: "space-between", padding: "0.875rem 1.25rem", backgroundColor: t.bgNav, backdropFilter: "blur(16px)", borderBottom: `1px solid ${t.navBorder}` }}>
          <a href="/" style={{ textDecoration: "none" }}><LogoWordmark size={28} /></a>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ThemeToggle theme={theme} toggle={toggleTheme} t={t} />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: "none", border: "none", color: t.text, cursor: "pointer", padding: "0.25rem" }} aria-label="Toggle menu">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Overlay */}
        {isMenuOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 40, backgroundColor: t.bgOverlay, backdropFilter: "blur(16px)", paddingTop: "5rem", display: "flex" }}>
            <ul style={{ listStyle: "none", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {navLinks.map(l => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setIsMenuOpen(false)} className="hover-text" style={{ color: t.text, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif", fontSize: "2rem", fontWeight: 700 }}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ══ HERO ══ */}
        <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 1.5rem 3rem", textAlign: "center", position: "relative", overflow: "hidden", backgroundColor: t.bg }}>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: `linear-gradient(${t.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${t.gridColor} 1px, transparent 1px)`, backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 900, width: "100%" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", border: `1px solid ${t.borderAccent}`, borderRadius: "2rem", padding: "0.3rem 1rem", marginBottom: "2.5rem", fontSize: "0.7rem", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, letterSpacing: "0.15em", color: t.textMuted }}>
              <span style={dot}></span> DATA SCIENCE & ANALYTICS · GHANA
            </div>
            <h1 style={{ ...heading, fontSize: "clamp(2.8rem,9vw,6.5rem)", lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "1.5rem", color: t.text }}>
              I BUILD WITH<br /><span style={{ color: t.accentGlow }}>DATA & CODE.</span>
            </h1>
            <p style={{ ...muted, fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.05em", fontSize: "clamp(0.8rem,2vw,1rem)", maxWidth: 560, margin: "0 auto 3rem" }}>
              Student. Developer. Builder. Exploring the intersection of data, software and intelligent systems.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
              <a href="#work" style={btn} className="btn-glow">VIEW MY WORK <ArrowRight size={16} /></a>
              <a href="#contact" style={btnOutline} className="btn-glow">LET'S TALK <ArrowRight size={16} /></a>
            </div>
            <div style={{ display: "flex", gap: "3rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "4rem", paddingTop: "2rem", borderTop: `1px solid ${t.statBorder}` }}>
              {[{ num: "5+", label: "Projects Built" }, { num: "4+", label: "Technologies" }, { num: "2026", label: "Current Year" }].map(stat => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <p style={{ ...heading, fontSize: "1.75rem", color: t.accentGlow, lineHeight: 1 }}>{stat.num}</p>
                  <p style={{ ...muted, fontSize: "0.75rem", letterSpacing: "0.08em", marginTop: "0.3rem" }}>{stat.label}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: t.textMuted }}>
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em" }}>SCROLL TO EXPLORE</span>
              <ArrowDown size={14} />
            </div>
          </div>
        </section>

        {/* ══ WORK ══ */}
        <LitSection id="work" theme={theme}>
          <div style={section}>
            <div style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                <span style={sectionNum}>01</span>
                <h2 className="hover-text" style={sectionTitle}>Selected Work</h2>
              </div>
              <p style={{ ...muted, marginTop: "0.75rem", fontSize: "0.9375rem" }}>Projects across data analysis, software development and creative technology</p>
            </div>
            {projects.map(p => (
              <div key={p.id} className="card-hover" style={{ borderBottom: `1px solid ${t.border}`, padding: "2.5rem 0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "2.5rem" }}>
                <div style={{ background: theme === "dark" ? "linear-gradient(135deg,rgba(0,229,255,0.07),transparent)" : "linear-gradient(135deg,rgba(0,150,180,0.08),transparent)", borderRadius: "0.5rem", aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.borderAccent}`, position: "relative", overflow: "hidden" }}>
                  <span aria-hidden="true" style={{ position: "absolute", top: 8, left: 8, width: 12, height: 12, borderTop: `1px solid ${t.bracketColor}`, borderLeft: `1px solid ${t.bracketColor}` }} />
                  <span aria-hidden="true" style={{ position: "absolute", top: 8, right: 8, width: 12, height: 12, borderTop: `1px solid ${t.bracketColor}`, borderRight: `1px solid ${t.bracketColor}` }} />
                  <span aria-hidden="true" style={{ position: "absolute", bottom: 8, left: 8, width: 12, height: 12, borderBottom: `1px solid ${t.bracketColor}`, borderLeft: `1px solid ${t.bracketColor}` }} />
                  <span aria-hidden="true" style={{ position: "absolute", bottom: 8, right: 8, width: 12, height: 12, borderBottom: `1px solid ${t.bracketColor}`, borderRight: `1px solid ${t.bracketColor}` }} />
                  <span style={{ ...heading, fontSize: "3.5rem", color: t.accentGlow, opacity: 0.15 }}>0{p.id}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={label}>PROJECT 0{p.id}</span>
                  <h3 className="hover-text" style={{ ...heading, fontSize: "clamp(1.2rem,3vw,1.6rem)", marginBottom: "0.75rem", lineHeight: 1.25, color: t.text }}>{p.title}</h3>
                  <p style={{ ...muted, marginBottom: "1.25rem", lineHeight: 1.75, fontSize: "0.9375rem" }}>{p.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                    {p.technologies.map(tech => <span key={tech} className="tag-hover" style={tag}>{tech}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem" }}>
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: t.accentGlow, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "0.8rem" }}><Link size={14} /> CODE</a>}
                    {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: t.accentGlow, textDecoration: "none", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, fontSize: "0.8rem" }}><ExternalLink size={14} /> DEMO</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </LitSection>

        {/* ══ ABOUT ══ */}
        <LitSection id="about" theme={theme}>
          <div style={section}>
            <div style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                <span style={sectionNum}>02</span>
                <h2 className="hover-text" style={sectionTitle}>About Me</h2>
              </div>
            </div>
            <p style={{ ...muted, fontSize: "1.125rem", lineHeight: 1.85, maxWidth: 680, marginBottom: "1.5rem" }}>
              I'm <span className="hover-text" style={{ color: t.accentGlow, fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 }}>Alfred Ofori</span>, a Data Science & Analytics student and software developer from Ghana interested in building technology that solves practical problems.
            </p>
            <p style={{ ...muted, fontSize: "1.125rem", lineHeight: 1.85, maxWidth: 680, marginBottom: "3rem" }}>
              I work across data, software and the web — turning ideas into useful digital products while continuously learning new technologies.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "2rem", padding: "2.5rem 0", borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}` }}>
              {[{ label: "BASED IN", value: "GHANA" }, { label: "FIELD", value: "DATA SCIENCE" }, { label: "FOCUS", value: "DATA · CODE" }, { label: "STATUS", value: "ACTIVE", accent: true }].map(i => (
                <div key={i.label}>
                  <p style={{ fontSize: "0.65rem", color: t.textMuted, fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "0.4rem" }}>{i.label}</p>
                  <p className="hover-text" style={{ ...heading, fontSize: "1.1rem", color: i.accent ? t.accentGlow : t.text }}>{i.value}</p>
                </div>
              ))}
            </div>
          </div>
        </LitSection>

        {/* ══ WHAT I DO ══ */}
        <LitSection theme={theme}>
          <div style={section}>
            <div style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                <span style={sectionNum}>03</span>
                <h2 className="hover-text" style={sectionTitle}>What I Do</h2>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "1.25rem" }}>
              {[
                { num: "01", title: "Data Analytics", desc: "Turning raw data into meaningful insights.", tags: ["Python", "SQL", "Pandas", "Statistics"] },
                { num: "02", title: "Software Development", desc: "Building software for real-world problems.", tags: ["C++", "Python", "JavaScript", "React"] },
                { num: "03", title: "Web Development", desc: "Creating responsive modern digital experiences.", tags: ["HTML", "CSS", "React", "TypeScript"] },
                { num: "04", title: "AI & Automation", desc: "Exploring intelligent systems and workflows.", tags: ["Python", "APIs", "AI", "Automation"] },
              ].map(item => (
                <div key={item.num} className="card-hover" style={card}>
                  <span aria-hidden="true" style={{ position: "absolute", top: 10, left: 10, width: 10, height: 10, borderTop: `1px solid ${t.bracketColor}`, borderLeft: `1px solid ${t.bracketColor}` }} />
                  <span aria-hidden="true" style={{ position: "absolute", bottom: 10, right: 10, width: 10, height: 10, borderBottom: `1px solid ${t.bracketColor}`, borderRight: `1px solid ${t.bracketColor}` }} />
                  <span style={label}>{item.num}</span>
                  <h3 className="hover-text" style={{ ...heading, fontSize: "1.2rem", marginBottom: "0.75rem", color: t.text }}>{item.title}</h3>
                  <p style={{ ...muted, fontSize: "0.9375rem", marginBottom: "1.25rem", lineHeight: 1.7 }}>{item.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                    {item.tags.map(tg => <span key={tg} className="tag-hover" style={tag}>{tg}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </LitSection>

        {/* ══ STACK ══ */}
        <LitSection id="stack" theme={theme}>
          <div style={section}>
            <div style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                <span style={sectionNum}>04</span>
                <h2 className="hover-text" style={sectionTitle}>Tech Stack</h2>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "2.5rem" }}>
              {skillGroups.map(g => (
                <div key={g.category}>
                  <h3 className="hover-text" style={{ fontSize: "0.65rem", ...heading, color: t.accentGlow, letterSpacing: "0.15em", marginBottom: "1rem" }}>{g.category}</h3>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {g.items.map(item => (
                      <li key={item} className="hover-text" style={{ color: t.textMuted, fontSize: "0.9375rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: t.dotBg, display: "inline-block", flexShrink: 0 }} />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </LitSection>

        {/* ══ JOURNEY ══ */}
        <LitSection theme={theme}>
          <div style={section}>
            <div style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                <span style={sectionNum}>05</span>
                <h2 className="hover-text" style={sectionTitle}>Journey</h2>
              </div>
            </div>
            <div style={{ maxWidth: 580 }}>
              {timeline.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: t.accentGlow, boxShadow: `0 0 12px ${t.accentGlow}99`, marginTop: 5 }} />
                    {i < timeline.length - 1 && <div style={{ width: 1, flexGrow: 1, background: `linear-gradient(to bottom,${t.accentGlow},${t.accentGlow}08)`, minHeight: "3.5rem" }} />}
                  </div>
                  <div style={{ paddingBottom: i < timeline.length - 1 ? "2rem" : 0 }}>
                    <span style={{ fontSize: "0.65rem", ...heading, color: t.accentGlow, letterSpacing: "0.15em" }}>{item.year}</span>
                    <h3 className="hover-text" style={{ ...heading, fontSize: "1.15rem", margin: "0.35rem 0 0.3rem", color: t.text }}>{item.title}</h3>
                    <p style={{ ...muted, fontSize: "0.9375rem", lineHeight: 1.7 }}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </LitSection>

        {/* ══ GITHUB CTA ══ */}
        <LitSection theme={theme}>
          <div style={section}>
            <div style={{ borderTop: `1px solid ${t.border}`, borderBottom: `1px solid ${t.border}`, padding: "4rem 0" }}>
              <h2 className="hover-text" style={{ ...heading, fontSize: "clamp(2rem,5vw,3.5rem)", marginBottom: "1.25rem", color: t.text }}>CODE IS PART OF THE PROCESS.</h2>
              <p style={{ ...muted, fontSize: "1.125rem", marginBottom: "2.5rem", maxWidth: 480, lineHeight: 1.75 }}>Explore the projects, experiments and systems I'm building.</p>
              <a href="https://github.com/bigg8t27-sudo" target="_blank" rel="noopener noreferrer" style={btnOutline} className="btn-glow">
                <Link size={16} /> EXPLORE GITHUB <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </LitSection>

        {/* ══ CONTACT ══ */}
        <LitSection id="contact" theme={theme}>
          <div style={section}>
            <div style={{ marginBottom: "4rem" }}>
              <h2 className="hover-text" style={{ ...heading, fontSize: "clamp(2.5rem,7vw,5rem)", lineHeight: 1.0, marginBottom: "1.5rem", color: t.text }}>
                HAVE AN IDEA?<br /><span style={{ color: t.accentGlow }}>LET'S BUILD SOMETHING.</span>
              </h2>
              <p style={{ ...muted, fontSize: "1.125rem", maxWidth: 580, lineHeight: 1.75 }}>Whether it's a software project, data problem, collaboration or an interesting idea, I'd love to hear from you.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "4rem" }}>
              <div>
                <span style={label}>GET IN TOUCH</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {contacts.map(c => (
                    <a key={c.label} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ display: "flex", gap: "1rem", textDecoration: "none" }} className="hover-text">
                      {c.isPhone ? <Phone size={18} style={{ color: t.accentGlow, marginTop: 2, flexShrink: 0 }} /> : <Mail size={18} style={{ color: t.accentGlow, marginTop: 2, flexShrink: 0 }} />}
                      <div>
                        <p style={{ fontSize: "0.65rem", color: t.textMuted, fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "0.2rem" }}>{c.label}</p>
                        <p style={{ color: t.text, fontSize: "0.9375rem" }}>{c.text}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {(["Name","Email","Message"] as const).map(field => (
                  <div key={field}>
                    <label style={{ display: "block", fontSize: "0.8rem", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, marginBottom: "0.5rem", color: t.text, letterSpacing: "0.05em" }}>{field.toUpperCase()}</label>
                    {field === "Message"
                      ? <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Your message..." rows={5} style={{ ...input, resize: "none" }} />
                      : <input type={field === "Email" ? "email" : "text"} value={form[field.toLowerCase() as "name"|"email"]} onChange={e => setForm({ ...form, [field.toLowerCase()]: e.target.value })} placeholder={field === "Email" ? "your@email.com" : "Your name"} style={input} />
                    }
                  </div>
                ))}
                {formError && <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>{formError}</p>}
                {submitted && <p style={{ color: t.accentGlow, fontSize: "0.875rem" }}>Thank you! I'll get back to you soon.</p>}
                <button type="submit" style={{ ...btn, justifyContent: "center", fontSize: "0.875rem", letterSpacing: "0.08em" }} className="btn-glow">SEND MESSAGE</button>
              </form>
            </div>
          </div>
        </LitSection>

        {/* ══ FOOTER ══ */}
        <LitSection style={{ borderTop: `1px solid ${t.border}` }} theme={theme}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 1.5rem", background: t.bgFooter, backdropFilter: "blur(8px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "3rem", marginBottom: "3rem" }}>
              <div>
                <div style={{ marginBottom: "1rem" }}><LogoWordmark size={30} /></div>
                <p style={{ ...muted, fontSize: "0.875rem", lineHeight: 1.8 }}>Data Science & Analytics<br />Software Development<br />Creative Technology</p>
              </div>
              <div>
                <h3 style={label}>NAVIGATION</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[["Work","#work"],["About","#about"],["Stack","#stack"],["Contact","#contact"]].map(([l,h]) => (
                    <li key={h}><a href={h} className="hover-text" style={{ color: t.textMuted, textDecoration: "none", fontSize: "0.9375rem" }}>{l}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 style={label}>CONTACT</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <li style={{ color: t.textMuted, fontSize: "0.875rem" }}>0597 580 576</li>
                  <li style={{ color: t.textMuted, fontSize: "0.875rem" }}>0598 942 192</li>
                  <li style={{ color: t.textMuted, fontSize: "0.875rem" }}>alfred@example.com</li>
                </ul>
              </div>
              <div>
                <h3 style={label}>SOCIAL</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[["GitHub","https://github.com/bigg8t27-sudo"],["LinkedIn","https://linkedin.com/in/alfredofori"]].map(([l,h]) => (
                    <li key={l}><a href={h} target="_blank" rel="noopener noreferrer" className="hover-text" style={{ color: t.textMuted, textDecoration: "none", fontSize: "0.9375rem" }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: "2rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              <p style={{ ...muted, fontSize: "0.8rem" }}>© 2026 Alfred Ofori. All rights reserved.</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", color: t.textMuted, fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.1em" }}>
                <span style={{ ...dot, width: 6, height: 6 }}></span> SYSTEM ONLINE
              </div>
            </div>
          </div>
        </LitSection>
      </div>
    </div>
  );
}