/**
 * PageTransition.tsx
 * Premium futuristic redirect/transition screen for Alfred Ofori's portfolio.
 *
 * Architecture:
 * - Intercepts anchor (#section) clicks via a global event listener
 * - Shows a full-screen cinematic transition, then scrolls to the destination
 * - Uses GSAP (already installed) for timeline control
 * - Uses only CSS transforms, opacity, SVG — no heavy 3D libraries
 * - Respects prefers-reduced-motion
 * - Cleans up all timers and listeners on unmount
 */

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

// ── Types ─────────────────────────────────────────────────────────────────────

type TransitionState = "idle" | "entering" | "active" | "exiting";

interface TransitionConfig {
  /** Destination section id, e.g. "work", "about", "contact" */
  destination: string;
  /** Label shown on screen, e.g. "PROJECTS" */
  label: string;
  /** Total duration in ms before exit begins */
  duration?: number;
}

// ── Destination map ───────────────────────────────────────────────────────────

const DEST_MAP: Record<string, string> = {
  work: "PROJECTS",
  about: "ABOUT ME",
  stack: "TECH STACK",
  contact: "CONTACT",
  hero: "HOME",
};

function getLabel(hash: string): string {
  const id = hash.replace("#", "").toLowerCase();
  return DEST_MAP[id] ?? id.toUpperCase();
}

// ── System messages ───────────────────────────────────────────────────────────

const SYSTEM_MESSAGES = [
  "INITIALIZING...",
  "ESTABLISHING CONNECTION...",
  "LOADING DATA MODULE...",
  "VERIFYING ROUTE...",
  "COMPILING INTERFACE...",
  "ROUTING USER...",
  "ACCESS GRANTED",
];

// ── Data Core SVG ─────────────────────────────────────────────────────────────

function DataCore({ active, accent }: { active: boolean; accent: string }) {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {/* Outer ring — slow rotation */}
      <circle
        cx="110" cy="110" r="96"
        stroke={`${accent}18`}
        strokeWidth="1"
      />
      {/* Mid ring */}
      <circle
        cx="110" cy="110" r="72"
        stroke={`${accent}28`}
        strokeWidth="0.8"
        strokeDasharray="8 6"
        style={{
          transformOrigin: "110px 110px",
          animation: active ? "coreRotate 8s linear infinite" : "none",
        }}
      />
      {/* Inner ring */}
      <circle
        cx="110" cy="110" r="50"
        stroke={`${accent}40`}
        strokeWidth="1"
        strokeDasharray="4 8"
        style={{
          transformOrigin: "110px 110px",
          animation: active ? "coreRotateRev 5s linear infinite" : "none",
        }}
      />
      {/* Arc — charge indicator */}
      <circle
        cx="110" cy="110" r="96"
        stroke={accent}
        strokeWidth="1.5"
        strokeDasharray="0 603"
        strokeLinecap="round"
        strokeOpacity="0.7"
        style={{
          transformOrigin: "110px 110px",
          transform: "rotate(-90deg)",
          animation: active ? "coreArc 1.6s ease-out forwards" : "none",
        }}
      />
      {/* Data nodes on outer ring */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 110 + 96 * Math.cos(rad);
        const y = 110 + 96 * Math.sin(rad);
        return (
          <circle key={i} cx={x} cy={y} r="3" fill={accent} opacity={active ? 0.8 : 0} style={{ transition: `opacity 0.4s ${i * 0.1}s` }} />
        );
      })}
      {/* Inner data nodes */}
      {[36, 108, 180, 252, 324].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 110 + 50 * Math.cos(rad);
        const y = 110 + 50 * Math.sin(rad);
        return (
          <circle key={i} cx={x} cy={y} r="2" fill={`${accent}99`} opacity={active ? 0.6 : 0} style={{ transition: `opacity 0.3s ${i * 0.08 + 0.2}s` }} />
        );
      })}
      {/* Connector lines from center to nodes */}
      {[0, 72, 144, 216, 288].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 110 + 50 * Math.cos(rad);
        const y = 110 + 50 * Math.sin(rad);
        return (
          <line key={i} x1="110" y1="110" x2={x} y2={y} stroke={`${accent}25`} strokeWidth="0.7" opacity={active ? 1 : 0} style={{ transition: `opacity 0.4s ${i * 0.1 + 0.15}s` }} />
        );
      })}
      {/* Center glow */}
      <circle cx="110" cy="110" r="10" fill={accent} opacity={active ? 0.15 : 0} style={{ transition: "opacity 0.5s", filter: `blur(4px)` }} />
      <circle cx="110" cy="110" r="5" fill={accent} opacity={active ? 0.9 : 0} style={{ transition: "opacity 0.4s 0.1s" }} />
      <circle cx="110" cy="110" r="2.5" fill="#ffffff" opacity={active ? 1 : 0} style={{ transition: "opacity 0.3s 0.15s" }} />
    </svg>
  );
}

// ── Scanning line ─────────────────────────────────────────────────────────────

function ScanLine() {
  return (
    <div aria-hidden="true" style={{
      position: "absolute", left: 0, right: 0, height: 1,
      background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.4), transparent)",
      animation: "scanLine 2.4s linear infinite",
      pointerEvents: "none",
    }} />
  );
}

// ── Floating particles ────────────────────────────────────────────────────────

function Particles({ count = 18, accent }: { count?: number; accent: string }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: Math.random() * 6 + 4,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: accent,
            opacity: p.opacity,
            animation: `particleFloat ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ── Corner brackets ───────────────────────────────────────────────────────────

function CornerBrackets({ accent }: { accent: string }) {
  const style = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: 24,
    height: 24,
    ...pos,
  });
  const line = `1.5px solid ${accent}`;
  return (
    <>
      <div aria-hidden="true" style={style({ top: 24, left: 24, borderTop: line, borderLeft: line })} />
      <div aria-hidden="true" style={style({ top: 24, right: 24, borderTop: line, borderRight: line })} />
      <div aria-hidden="true" style={style({ bottom: 24, left: 24, borderBottom: line, borderLeft: line })} />
      <div aria-hidden="true" style={style({ bottom: 24, right: 24, borderBottom: line, borderRight: line })} />
    </>
  );
}

// ── Edge system labels ────────────────────────────────────────────────────────

const EDGE_LABELS = ["SYS.01", "NODE_07", "DATA_STREAM", "AUTH_204", "ONLINE", "CPU_OK", "MEM_64", "LATENCY"];

function EdgeLabels({ accent }: { accent: string }) {
  return (
    <>
      {EDGE_LABELS.slice(0, 4).map((label, i) => (
        <div
          key={label}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 48,
            top: 80 + i * 52,
            fontSize: "0.55rem",
            fontFamily: "Space Grotesk, sans-serif",
            letterSpacing: "0.12em",
            color: `${accent}50`,
            animation: `labelFlicker ${2 + i * 0.7}s ${i * 0.3}s ease-in-out infinite alternate`,
          }}
        >
          {label}
        </div>
      ))}
      {EDGE_LABELS.slice(4).map((label, i) => (
        <div
          key={label}
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 48,
            top: 80 + i * 52,
            fontSize: "0.55rem",
            fontFamily: "Space Grotesk, sans-serif",
            letterSpacing: "0.12em",
            color: `${accent}50`,
            textAlign: "right",
            animation: `labelFlicker ${2.5 + i * 0.5}s ${i * 0.4 + 0.2}s ease-in-out infinite alternate`,
          }}
        >
          {label}
        </div>
      ))}
    </>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

interface PageTransitionProps {
  /** Accent color — defaults to portfolio cyan */
  accent?: string;
  /** Total active duration in ms */
  duration?: number;
}

export function PageTransition({
  accent = "#00E5FF",
  duration = 1800,
}: PageTransitionProps) {
  const [state, setState] = useState<TransitionState>("idle");
  const [config, setConfig] = useState<TransitionConfig>({ destination: "", label: "" });
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [coreActive, setCoreActive] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);
  const rafRef = useRef<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const addTimer = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  };

  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  // Animate progress from 0 → 100 over the active duration
  const animateProgress = useCallback((startTime: number, dur: number) => {
    const tick = () => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / dur) * 100));
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  // Cycle system messages
  const cycleMessages = useCallback((dur: number) => {
    const step = Math.floor(dur / SYSTEM_MESSAGES.length);
    SYSTEM_MESSAGES.forEach((_, i) => {
      if (i === 0) return;
      addTimer(() => setMsgIndex(i), i * step);
    });
  }, []);

  // Full transition sequence
  const runTransition = useCallback((dest: string, label: string) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    clearAll();
    setProgress(0);
    setMsgIndex(0);
    setCoreActive(false);
    setConfig({ destination: dest, label });
    setState("entering");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      // Skip visuals — just a fast fade
      setState("active");
      setCoreActive(true);
      addTimer(() => {
        setState("exiting");
        addTimer(() => {
          setState("idle");
          isTransitioning.current = false;
          // Scroll to destination
          const el = document.getElementById(dest);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }, 400);
      return;
    }

    // Enter animation via GSAP
    addTimer(() => {
      if (overlayRef.current) {
        gsap.fromTo(overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power2.out" }
        );
      }
      setState("active");
      setCoreActive(true);

      const activeDur = duration - 300; // leave 300ms for exit
      const startTime = performance.now();
      animateProgress(startTime, activeDur);
      cycleMessages(activeDur);

      // Begin exit when progress done
      addTimer(() => {
        setState("exiting");
        if (overlayRef.current && contentRef.current) {
          gsap.to(contentRef.current, { opacity: 0, scale: 1.04, duration: 0.25, ease: "power2.in" });
          gsap.to(overlayRef.current, {
            opacity: 0, duration: 0.3, delay: 0.15, ease: "power2.in",
            onComplete: () => {
              setState("idle");
              isTransitioning.current = false;
              setCoreActive(false);
              setProgress(0);
              const el = document.getElementById(dest);
              if (el) {
                el.scrollIntoView({ behavior: "smooth" });
              }
            }
          });
        }
      }, activeDur + 50);
    }, 20);
  }, [duration, animateProgress, cycleMessages, clearAll]);

  // Intercept all anchor clicks that target #sections
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null;
      if (!target) return;
      const href = target.getAttribute("href") ?? "";
      if (!href.startsWith("#")) return; // ignore external links

      const dest = href.replace("#", "");
      if (dest === "hero" || dest === "") return; // don't animate scroll to very top

      e.preventDefault();
      const label = getLabel(href);
      runTransition(dest, label);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [runTransition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAll();
  }, [clearAll]);

  if (state === "idle") return null;

  const isLight = false; // always dark overlay regardless of site theme

  return (
    <>
      {/* ── Keyframe styles injected once ── */}
      <style>{`
        @keyframes coreRotate    { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes coreRotateRev { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
        @keyframes coreArc       { from { stroke-dasharray: 0 603; }   to { stroke-dasharray: 603 603; } }
        @keyframes scanLine      { from { top: 0%; }                   to { top: 100%; } }
        @keyframes particleFloat { from { transform: translateY(0px); } to { transform: translateY(-14px); } }
        @keyframes labelFlicker  { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes glitchShift   { 0%,100%{transform:none;clip-path:none} 20%{transform:translateX(3px);clip-path:inset(10% 0 80% 0)} 40%{transform:translateX(-2px);clip-path:inset(60% 0 20% 0)} 60%{transform:none;clip-path:none} }
        @keyframes fadeInUp      { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes pulseDot      { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.5)} }
      `}</style>

      {/* ── Full-screen overlay ── */}
      <div
        ref={overlayRef}
        role="status"
        aria-live="polite"
        aria-label={`Navigating to ${config.label}`}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: "#040608",
          overflow: "hidden",
          fontFamily: "Space Grotesk, sans-serif",
          userSelect: "none",
        }}
      >
        {/* Subtle dot grid */}
        <div aria-hidden="true" style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle, ${accent}12 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.6,
        }} />

        {/* Horizontal gradient accent at top */}
        <div aria-hidden="true" style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${accent}60, transparent)`,
        }} />

        {/* Scanning line */}
        <ScanLine />

        {/* Floating particles */}
        <Particles accent={accent} count={14} />

        {/* Corner brackets */}
        <CornerBrackets accent={accent} />

        {/* Edge system labels (desktop only) */}
        <div style={{ display: window.innerWidth < 768 ? "none" : "block" }}>
          <EdgeLabels accent={accent} />
        </div>

        {/* ── Main content ── */}
        <div
          ref={contentRef}
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            padding: "2rem",
            gap: 0,
          }}
        >
          {/* Top-left branding */}
          <div style={{
            position: "absolute", top: 32, left: 48,
            animation: "fadeInUp 0.4s ease-out both",
          }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: `${accent}80`, marginBottom: "0.25rem" }}>
              PORTFOLIO SYSTEM
            </p>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.1em", color: "#F5F5F5" }}>
              ALFRED OFORI
            </p>
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: `${accent}60`, marginTop: "0.2rem" }}>
              DATA · CODE · ANALYTICS
            </p>
          </div>

          {/* Bottom-left status */}
          <div style={{
            position: "absolute", bottom: 32, left: 48,
            animation: "fadeInUp 0.4s 0.2s ease-out both",
          }}>
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: `${accent}60`, marginBottom: "0.2rem" }}>
              SYSTEM STATUS
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                backgroundColor: "#22c55e",
                boxShadow: "0 0 6px #22c55e",
                animation: "pulseDot 2s ease-in-out infinite",
                display: "inline-block",
              }} />
              <span style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", color: "#22c55e" }}>
                ONLINE
              </span>
            </div>
          </div>

          {/* Bottom-right destination */}
          <div style={{
            position: "absolute", bottom: 32, right: 48, textAlign: "right",
            animation: "fadeInUp 0.4s 0.25s ease-out both",
          }}>
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: `${accent}60`, marginBottom: "0.2rem" }}>
              DESTINATION
            </p>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.12em", color: accent }}>
              {config.label}
            </p>
          </div>

          {/* ── CENTER ── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>

            {/* Data core */}
            <div style={{ position: "relative", width: 220, height: 220 }}>
              <DataCore active={coreActive} accent={accent} />
              {/* Inner glow pulse */}
              <div aria-hidden="true" style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: coreActive ? 80 : 0,
                height: coreActive ? 80 : 0,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
                transition: "width 0.6s, height 0.6s",
                pointerEvents: "none",
              }} />
            </div>

            {/* Routing label */}
            <div style={{ textAlign: "center", animation: "fadeInUp 0.5s 0.2s ease-out both" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.25em", color: `${accent}70`, marginBottom: "0.5rem" }}>
                ROUTING TO
              </p>
              <p style={{
                fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#F5F5F5",
                animation: "glitchShift 3s 0.8s ease-in-out 1",
              }}>
                {config.label}
              </p>
            </div>

            {/* System message */}
            <p
              key={msgIndex}
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: `${accent}60`,
                animation: "fadeInUp 0.3s ease-out both",
              }}
              aria-live="off"
            >
              {SYSTEM_MESSAGES[msgIndex]}
            </p>

            {/* Progress */}
            <div style={{ width: "clamp(200px, 40vw, 320px)", textAlign: "center", animation: "fadeInUp 0.5s 0.3s ease-out both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: `${accent}60` }}>LOADING</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", color: accent, fontVariantNumeric: "tabular-nums" }}>
                  {String(progress).padStart(3, "0")}%
                </span>
              </div>
              {/* Track */}
              <div style={{ height: 1.5, backgroundColor: `${accent}18`, borderRadius: 999, overflow: "hidden" }}>
                {/* Fill */}
                <div style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${accent}80, ${accent})`,
                  boxShadow: `0 0 8px ${accent}`,
                  borderRadius: 999,
                  transition: "width 0.08s linear",
                }} />
              </div>
            </div>

          </div>{/* end CENTER */}

        </div>{/* end content */}
      </div>
    </>
  );
}

export default PageTransition;
