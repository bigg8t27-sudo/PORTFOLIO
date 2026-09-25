/**
 * BookNav.tsx
 * Premium CSS 3D book with nav links on the cover.
 * - Spine: "Senior Dev."
 * - Cover: WORK / ABOUT / STACK / CONTACT (all clickable)
 * - Mouse tracking → subtle 3D tilt
 * - Hover → book opens slightly
 */
import { useEffect, useRef, useState } from "react";

interface NavLink { label: string; href: string; }

interface BookNavProps {
  navLinks: NavLink[];
  accent?: string;
  onNavigate: (href: string) => void;
}

export function BookNav({ navLinks, accent = "#00E5FF", onNavigate }: BookNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(-4);
  const [rotY, setRotY] = useState(20);
  const [hovered, setHovered] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const reduced = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduced) return;
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setRotX(-dy * 10 - 4);
      setRotY(dx * 12 + 20);
    };

    const onLeave = () => {
      setRotX(-4);
      setRotY(20);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  // Book dimensions
  const W  = 240;  // cover width
  const H  = 340;  // cover height
  const D  = 44;   // spine/thickness

  const coverBg    = "linear-gradient(145deg,#0c1828 0%,#0a1520 55%,#060e18 100%)";
  const spineBg    = "linear-gradient(180deg,#152238 0%,#0a1824 50%,#060e18 100%)";
  const pageBg     = "#d4c9b0";
  const pageEdge   = "repeating-linear-gradient(to right,#c8bb9a,#d4c9b0 1px,#c8bb9a 2px)";

  return (
    <div
      ref={containerRef}
      style={{
        width: W + D + 20,
        height: H + 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "900px",
        cursor: "pointer",
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Portfolio navigation book"
    >
      {/* 3D scene */}
      <div style={{
        position: "relative",
        width: W,
        height: H,
        transformStyle: "preserve-3d",
        transform: `rotateX(${rotX}deg) rotateY(${reduced ? 20 : rotY + (hovered ? -6 : 0)}deg)`,
        transition: reduced ? "none" : "transform 0.18s cubic-bezier(0.22,1,0.36,1)",
      }}>

        {/* ── FRONT COVER ── */}
        <div style={{
          position: "absolute",
          width: W, height: H,
          background: coverBg,
          borderRadius: "0 4px 4px 0",
          backfaceVisibility: "hidden",
          boxShadow: `4px 6px 40px rgba(0,0,0,0.7), inset -1px 0 0 rgba(255,255,255,0.05)`,
          border: `1px solid ${accent}20`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "28px 22px",
        }}>
          {/* Top corner brackets */}
          <span style={{ position: "absolute", top: 12, left: 12, width: 14, height: 14, borderTop: `1.5px solid ${accent}60`, borderLeft: `1.5px solid ${accent}60` }} />
          <span style={{ position: "absolute", top: 12, right: 12, width: 14, height: 14, borderTop: `1.5px solid ${accent}60`, borderRight: `1.5px solid ${accent}60` }} />
          <span style={{ position: "absolute", bottom: 12, left: 12, width: 14, height: 14, borderBottom: `1.5px solid ${accent}60`, borderLeft: `1.5px solid ${accent}60` }} />
          <span style={{ position: "absolute", bottom: 12, right: 12, width: 14, height: 14, borderBottom: `1.5px solid ${accent}60`, borderRight: `1.5px solid ${accent}60` }} />

          {/* Subtle top accent line */}
          <div style={{ position: "absolute", top: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg,transparent,${accent}70,transparent)` }} />

          {/* Glow center radial */}
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%,${accent}08 0%,transparent 65%)`, pointerEvents: "none" }} />

          {/* Title — Senior Dev. */}
          <div style={{ marginBottom: "auto" }}>
            <p style={{ fontSize: "1.6rem", fontWeight: 700, fontFamily: "Space Grotesk,sans-serif", color: "#F0F0F0", letterSpacing: "0.04em", lineHeight: 1.15 }}>
              Senior<br />Dev.
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: `linear-gradient(90deg,transparent,${accent}40,transparent)`, margin: "16px 0" }} />

          {/* Nav links */}
          <nav aria-label="Book navigation">
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); onNavigate(link.href); }}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      textDecoration: "none",
                      fontFamily: "Space Grotesk,sans-serif",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      letterSpacing: hoveredLink === link.href ? "0.22em" : "0.14em",
                      color: hoveredLink === link.href ? accent : "rgba(240,240,240,0.75)",
                      transition: "color 0.2s,letter-spacing 0.25s",
                    }}
                  >
                    {/* Small accent dot */}
                    <span style={{
                      width: 4, height: 4,
                      borderRadius: "50%",
                      backgroundColor: hoveredLink === link.href ? accent : `${accent}50`,
                      display: "inline-block",
                      flexShrink: 0,
                      boxShadow: hoveredLink === link.href ? `0 0 6px ${accent}` : "none",
                      transition: "background-color 0.2s,box-shadow 0.2s",
                    }} />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom watermark line */}
          <div style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg,transparent,${accent}40,transparent)` }} />
        </div>

        {/* ── SPINE ── */}
        <div style={{
          position: "absolute",
          width: D, height: H,
          left: -D,
          top: 0,
          background: spineBg,
          borderRadius: "3px 0 0 3px",
          transform: "rotateY(-90deg)",
          transformOrigin: "right center",
          backfaceVisibility: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `-4px 0 16px rgba(0,0,0,0.6)`,
          borderRight: `1px solid ${accent}15`,
        }}>
          <span style={{
            fontFamily: "Space Grotesk,sans-serif",
            fontWeight: 700,
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: accent,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
            whiteSpace: "nowrap",
            textShadow: `0 0 8px ${accent}80`,
          }}>
            Senior Dev. — Portfolio
          </span>
        </div>

        {/* ── BACK COVER ── */}
        <div style={{
          position: "absolute",
          width: W, height: H,
          background: "linear-gradient(145deg,#060e18,#040c14)",
          borderRadius: "0 4px 4px 0",
          transform: "rotateY(180deg)",
          backfaceVisibility: "hidden",
        }} />

        {/* ── TOP edge ── */}
        <div style={{
          position: "absolute",
          width: W, height: D,
          top: 0, left: 0,
          background: pageBg,
          backgroundImage: pageEdge,
          transform: "rotateX(90deg)",
          transformOrigin: "top center",
        }} />

        {/* ── BOTTOM edge ── */}
        <div style={{
          position: "absolute",
          width: W, height: D,
          bottom: 0, left: 0,
          background: pageBg,
          backgroundImage: pageEdge,
          transform: "rotateX(-90deg)",
          transformOrigin: "bottom center",
        }} />

        {/* ── RIGHT edge (pages) ── */}
        <div style={{
          position: "absolute",
          width: 6, height: H,
          right: -5, top: 0,
          background: "repeating-linear-gradient(to bottom,#c8bb9a,#d4c9b0 1px,#c8bb9a 2px)",
          borderRadius: "0 2px 2px 0",
          boxShadow: "2px 0 6px rgba(0,0,0,0.3)",
        }} />

        {/* ── Drop shadow plane ── */}
        <div style={{
          position: "absolute",
          width: W * 1.1, height: 20,
          bottom: -30, left: "-5%",
          background: "radial-gradient(ellipse at center,rgba(0,0,0,0.5) 0%,transparent 70%)",
          transform: "rotateX(90deg)",
          transformOrigin: "bottom center",
          filter: "blur(6px)",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

export default BookNav;
