/**
 * GlitchLogo.tsx
 * Animated "ALFRED." nav wordmark.
 * Every 2s each letter independently disperses (splits apart) then snaps back.
 * Uses CSS keyframes injected once — no external library.
 */
import { useEffect, useRef, useState } from "react";

const LETTERS = ["A", "L", "F", "R", "E", "D"];

// Per-letter scatter targets — each letter flies to a unique position
const SCATTER: { x: number; y: number; r: number; opacity: number }[] = [
  { x: -14, y: -18, r: -8,  opacity: 0.15 },
  { x:  -6, y:  16, r:  5,  opacity: 0.1  },
  { x:  10, y: -12, r: -12, opacity: 0.2  },
  { x: -10, y:  20, r:  9,  opacity: 0.12 },
  { x:  18, y: -10, r: -6,  opacity: 0.18 },
  { x:   8, y:  14, r:  10, opacity: 0.1  },
];

interface GlitchLogoProps {
  size?: number;
  /** accent for the dot */
  accent?: string;
  /** text color */
  color?: string;
}

export function GlitchLogo({ size = 32, accent = "#00E5FF", color = "#F5F5F5" }: GlitchLogoProps) {
  const [dispersed, setDispersed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Every 2 seconds: scatter → reassemble
    intervalRef.current = setInterval(() => {
      setDispersed(true);
      timerRef.current = setTimeout(() => setDispersed(false), 480);
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const fontSize = size * 0.44;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.55rem",
        textDecoration: "none",
        userSelect: "none",
      }}
    >
      {/* Logo mark — unchanged, imported inline to keep component self-contained */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <polygon
          points="20,2 35,10.5 35,29.5 20,38 5,29.5 5,10.5"
          stroke="rgba(0,229,255,0.15)"
          strokeWidth="0.8"
          fill="none"
        />
        <line x1="12" y1="33" x2="20" y2="9" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="20" y1="9" x2="28" y2="33" stroke={accent} strokeWidth="1.8" strokeLinecap="round" />
        <line x1="14.5" y1="24" x2="25.5" y2="24" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="9" r="2" fill={accent} />
        <circle cx="14.5" cy="24" r="1.4" fill="none" stroke={accent} strokeWidth="1.2" />
        <circle cx="25.5" cy="24" r="1.4" fill="none" stroke={accent} strokeWidth="1.2" />
        <polyline points="28,33 31,33 31,28 34,28" stroke="rgba(0,229,255,0.5)" strokeWidth="1" strokeLinecap="round" fill="none" />
        <circle cx="34" cy="28" r="1" fill={accent} opacity="0.7" />
      </svg>

      {/* Letter-by-letter "ALFRED" */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: 0,
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 700,
          fontSize,
          letterSpacing: "0.06em",
          lineHeight: 1,
          overflow: "visible",
        }}
        aria-label="ALFRED"
      >
        {LETTERS.map((letter, i) => {
          const sc = SCATTER[i];
          return (
            <span
              key={i}
              aria-hidden="true"
              style={{
                display: "inline-block",
                color,
                transition: dispersed
                  ? `transform 0.18s cubic-bezier(0.4,0,1,1) ${i * 22}ms, opacity 0.18s ease ${i * 22}ms`
                  : `transform 0.32s cubic-bezier(0,0,0.2,1) ${(LETTERS.length - i) * 18}ms, opacity 0.32s ease ${(LETTERS.length - i) * 18}ms`,
                transform: dispersed
                  ? `translate(${sc.x}px, ${sc.y}px) rotate(${sc.r}deg) scale(0.7)`
                  : "translate(0,0) rotate(0deg) scale(1)",
                opacity: dispersed ? sc.opacity : 1,
              }}
            >
              {letter}
            </span>
          );
        })}
        {/* Accent dot */}
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            color: accent,
            transition: dispersed
              ? "transform 0.18s ease 140ms, opacity 0.18s ease 140ms"
              : "transform 0.32s ease 0ms, opacity 0.32s ease 0ms",
            transform: dispersed ? "translate(6px,-8px) scale(0.5)" : "translate(0,0) scale(1)",
            opacity: dispersed ? 0.1 : 1,
          }}
        >
          .
        </span>
      </span>
    </span>
  );
}

export default GlitchLogo;
