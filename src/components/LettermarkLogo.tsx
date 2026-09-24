/**
 * LettermarkLogo.tsx
 * Animated "A" lettermark — particles → nodes → form logo → solid → reset
 * Every 5 seconds. Uses requestAnimationFrame + React state only.
 * No heavy libraries. GPU-friendly (CSS transforms + opacity).
 */
import { useEffect, useRef, useState } from "react";

type Phase = "scatter" | "connect" | "form" | "solid" | "fade";

// Final "A" shape key points (40x40 viewBox)
const A_NODES = [
  { x: 20, y: 5  }, // 0 apex
  { x: 8,  y: 34 }, // 1 bottom-left
  { x: 13, y: 22 }, // 2 crossbar-left
  { x: 27, y: 22 }, // 3 crossbar-right
  { x: 32, y: 34 }, // 4 bottom-right
];

// Edges of the A
const A_EDGES = [[0,1],[0,4],[2,3]];

// Scatter positions — where particles start
const SCATTER_POS = [
  { x: 4,  y: 4  }, { x: 36, y: 6  }, { x: 22, y: 13 },
  { x: 30, y: 16 }, { x: 5,  y: 26 }, { x: 35, y: 24 },
  { x: 11, y: 36 }, { x: 31, y: 35 }, { x: 18, y: 20 },
  { x: 8,  y: 14 }, { x: 33, y: 12 }, { x: 20, y: 38 },
];

// Map scatter index → nearest A_NODE
const TO_NODE = [0, 0, 0, 3, 1, 4, 1, 4, 2, 1, 3, 4];

interface Props {
  size?: number;
  accent?: string;
  onNavigate?: () => void;
}

export function LettermarkLogo({ size = 40, accent = "#00E5FF", onNavigate }: Props) {
  const [phase, setPhase] = useState<Phase>("scatter");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [hovered, setHovered] = useState(false);

  const T = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };

  const startCycle = () => {
    setPhase("scatter");
    T(() => setPhase("connect"), 900);
    T(() => setPhase("form"),    1800);
    T(() => setPhase("solid"),   2900);
    T(() => setPhase("fade"),    4200);
    T(() => startCycle(),        5000);
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setPhase("solid"); return; }
    startCycle();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const isConnect = phase === "connect" || phase === "form" || phase === "solid";
  const isForm    = phase === "form"    || phase === "solid";
  const isSolid   = phase === "solid";
  const isFading  = phase === "fade";

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Alfred Ofori logo"
      style={{ cursor: onNavigate ? "pointer" : "default", display: "block", overflow: "visible" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onNavigate}
    >
      {/* ── Particles in scatter phase ── */}
      {SCATTER_POS.map((p, i) => {
        const target = A_NODES[TO_NODE[i]];
        const cx = isConnect ? target.x : p.x;
        const cy = isConnect ? target.y : p.y;
        return (
          <circle
            key={`pt-${i}`}
            cx={cx} cy={cy}
            r={isSolid || isFading ? 0 : 1.3}
            fill={accent}
            opacity={isSolid || isFading ? 0 : (phase === "scatter" ? 0.6 : 0.4)}
            style={{
              transition: `cx 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 35}ms,
                           cy 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 35}ms,
                           opacity 0.4s ease,
                           r 0.3s ease`,
            }}
          />
        );
      })}

      {/* ── Connection lines between nodes (connect + form phases) ── */}
      {A_EDGES.map(([a, b], i) => (
        <line
          key={`el-${i}`}
          x1={A_NODES[a].x} y1={A_NODES[a].y}
          x2={A_NODES[b].x} y2={A_NODES[b].y}
          stroke={accent}
          strokeWidth="0.7"
          opacity={isForm && !isSolid && !isFading ? 0.5 : 0}
          style={{ transition: `opacity 0.4s ease ${i * 80}ms` }}
        />
      ))}

      {/* ── Intermediate nodes dots ── */}
      {A_NODES.map((p, i) => (
        <circle
          key={`nd-${i}`}
          cx={p.x} cy={p.y}
          r={isForm && !isSolid && !isFading ? 2 : 0}
          fill="none"
          stroke={accent}
          strokeWidth="1"
          opacity={isForm && !isSolid && !isFading ? 0.8 : 0}
          style={{ transition: `r 0.3s ease ${i * 60}ms, opacity 0.3s ease ${i * 60}ms` }}
        />
      ))}

      {/* ── SOLID LOGO ── */}
      {/* Left leg */}
      <line x1="20" y1="5" x2="8" y2="34"
        stroke={accent} strokeWidth="2.4" strokeLinecap="round"
        opacity={isSolid || (hovered && !isFading) ? 1 : 0}
        style={{ transition: "opacity 0.35s ease 0ms", filter: isSolid ? `drop-shadow(0 0 4px ${accent}99)` : "none" }}
      />
      {/* Right leg */}
      <line x1="20" y1="5" x2="32" y2="34"
        stroke={accent} strokeWidth="2.4" strokeLinecap="round"
        opacity={isSolid || (hovered && !isFading) ? 1 : 0}
        style={{ transition: "opacity 0.35s ease 0.06s", filter: isSolid ? `drop-shadow(0 0 4px ${accent}99)` : "none" }}
      />
      {/* Crossbar */}
      <line x1="12.5" y1="22" x2="27.5" y2="22"
        stroke={accent} strokeWidth="2" strokeLinecap="round"
        opacity={isSolid || (hovered && !isFading) ? 1 : 0}
        style={{ transition: "opacity 0.35s ease 0.12s" }}
      />
      {/* Apex dot */}
      <circle cx="20" cy="5" r="2.5" fill={accent}
        opacity={isSolid || (hovered && !isFading) ? 1 : 0}
        style={{ transition: "opacity 0.3s ease 0.15s" }}
      />
      {/* Crossbar nodes */}
      <circle cx="12.5" cy="22" r="1.8" fill="none" stroke={accent} strokeWidth="1.2"
        opacity={isSolid || (hovered && !isFading) ? 0.8 : 0}
        style={{ transition: "opacity 0.3s ease 0.18s" }}
      />
      <circle cx="27.5" cy="22" r="1.8" fill="none" stroke={accent} strokeWidth="1.2"
        opacity={isSolid || (hovered && !isFading) ? 0.8 : 0}
        style={{ transition: "opacity 0.3s ease 0.18s" }}
      />
      {/* Outer hex ring — solid phase only */}
      <polygon points="20,1 36,9.5 36,30.5 20,39 4,30.5 4,9.5"
        stroke={`${accent}35`} strokeWidth="0.6" fill="none"
        opacity={isSolid ? 1 : 0}
        style={{ transition: "opacity 0.5s ease 0.25s" }}
      />
      {/* Hover glow particles */}
      {hovered && isSolid && [
        {x:14,y:10},{x:26,y:10},{x:8,y:28},{x:32,y:28},{x:20,y:2},
      ].map((p,i) => (
        <circle key={`hv-${i}`} cx={p.x} cy={p.y} r="1.5"
          fill={accent} opacity="0.5"
          style={{ animation: `hvFloat${i} 1s ${i*0.15}s ease-in-out infinite alternate` }}
        />
      ))}
    </svg>
  );
}

export default LettermarkLogo;
