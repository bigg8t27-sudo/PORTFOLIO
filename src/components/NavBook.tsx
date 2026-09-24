/**
 * NavBook.tsx
 * A CSS-only 3D book in the navbar.
 * - Spine: "Senior Dev."
 * - Cover: nav links (WORK · ABOUT · STACK · CONTACT), each clickable
 * - Hovering the book opens it slightly (tilt)
 * - Clicking a link triggers navigation
 */
import { useState } from "react";

interface NavBookProps {
  accent?: string;
  textColor?: string;
  onNavigate: (href: string) => void;
}

const NAV_LINKS = [
  { label: "WORK",    href: "#work"    },
  { label: "ABOUT",   href: "#about"   },
  { label: "STACK",   href: "#stack"   },
  { label: "CONTACT", href: "#contact" },
];

export function NavBook({ accent = "#00E5FF", textColor = "#F5F5F5", onNavigate }: NavBookProps) {
  const [hovered, setHovered] = useState(false);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tilt = hovered && !reduced ? "rotateY(-28deg) rotateX(4deg)" : "rotateY(-14deg) rotateX(2deg)";

  const W  = 72;   // book cover width
  const H  = 94;   // book cover height
  const D  = 14;   // spine depth

  return (
    <>
      <style>{`
        .book-wrap { perspective: 600px; cursor: pointer; }
        .book-3d   { transform-style: preserve-3d; transition: transform 0.4s cubic-bezier(0.22,1,0.36,1); }
        .book-link { transition: color 0.2s, letter-spacing 0.2s; }
        .book-link:hover { color: ${accent} !important; letter-spacing: 0.18em !important; }
      `}</style>

      <div
        className="book-wrap"
        style={{ width: W + D, height: H, position: "relative", flexShrink: 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Navigation book"
      >
        <div
          className="book-3d"
          style={{
            width: W,
            height: H,
            position: "absolute",
            left: D,
            top: 0,
            transform: tilt,
            transformOrigin: "left center",
          }}
        >
          {/* ── COVER (front face) ── */}
          <div style={{
            position: "absolute",
            width: W, height: H,
            background: `linear-gradient(145deg, #0d1a2a 0%, #0a1520 60%, #071018 100%)`,
            border: `1px solid ${accent}35`,
            borderRadius: "0 3px 3px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            boxShadow: `2px 4px 20px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,229,255,0.03)`,
            overflow: "hidden",
            zIndex: 2,
          }}>
            {/* Top accent line */}
            <div style={{ position: "absolute", top: 8, left: 8, right: 8, height: 1, background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }} />
            {/* Corner brackets */}
            <div style={{ position: "absolute", top: 5, left: 5, width: 8, height: 8, borderTop: `1px solid ${accent}70`, borderLeft: `1px solid ${accent}70` }} />
            <div style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderTop: `1px solid ${accent}70`, borderRight: `1px solid ${accent}70` }} />
            <div style={{ position: "absolute", bottom: 5, left: 5, width: 8, height: 8, borderBottom: `1px solid ${accent}70`, borderLeft: `1px solid ${accent}70` }} />
            <div style={{ position: "absolute", bottom: 5, right: 5, width: 8, height: 8, borderBottom: `1px solid ${accent}70`, borderRight: `1px solid ${accent}70` }} />

            {/* Nav links on cover */}
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="book-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.href);
                }}
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  fontWeight: 700,
                  fontSize: "0.5rem",
                  letterSpacing: "0.14em",
                  color: textColor,
                  textDecoration: "none",
                  display: "block",
                  textAlign: "center",
                  padding: "2px 0",
                }}
              >
                {link.label}
              </a>
            ))}

            {/* Bottom accent line */}
            <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, height: 1, background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />
            {/* Subtle accent glow dot center */}
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${accent}05 0%, transparent 70%)`, pointerEvents: "none" }} />
          </div>

          {/* ── SPINE (left face) ── */}
          <div style={{
            position: "absolute",
            width: D, height: H,
            left: -D,
            top: 0,
            background: `linear-gradient(180deg, #1a2e42 0%, #0d1f2d 50%, #071018 100%)`,
            borderRadius: "2px 0 0 2px",
            border: `1px solid ${accent}25`,
            borderRight: "none",
            transform: "rotateY(90deg)",
            transformOrigin: "right center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `-3px 0 12px rgba(0,0,0,0.5)`,
          }}>
            <span style={{
              fontFamily: "Space Grotesk, sans-serif",
              fontWeight: 700,
              fontSize: "0.4rem",
              letterSpacing: "0.16em",
              color: accent,
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              transform: "rotate(180deg)",
              whiteSpace: "nowrap",
            }}>
              Senior Dev.
            </span>
          </div>

          {/* ── TOP face ── */}
          <div style={{
            position: "absolute",
            width: W, height: D,
            top: 0, left: 0,
            background: `linear-gradient(90deg, #0d1520, #1a2a3a)`,
            transform: "rotateX(90deg)",
            transformOrigin: "top center",
            borderTop: `1px solid ${accent}20`,
          }} />

          {/* Page edges (right side) — thin stack lines */}
          <div style={{
            position: "absolute",
            width: 4, height: H,
            right: -3, top: 0,
            background: `repeating-linear-gradient(to bottom, #1a2a3a 0px, #0d1520 1px, #1a2a3a 2px)`,
            borderRadius: "0 2px 2px 0",
          }} />
        </div>
      </div>
    </>
  );
}

export default NavBook;
