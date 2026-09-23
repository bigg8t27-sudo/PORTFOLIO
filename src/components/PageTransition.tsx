/**
 * PageTransition.tsx - Premium futuristic redirect transition screen
 * Exposes a global trigger: window.__triggerTransition(dest, label)
 * Intercepts all #anchor clicks site-wide via document event delegation
 */
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

type TState = "idle" | "active" | "exiting";

const DEST_MAP: Record<string, string> = {
  work: "PROJECTS", about: "ABOUT ME", stack: "TECH STACK",
  contact: "CONTACT", hero: "HOME",
};
function getLabel(id: string): string {
  return DEST_MAP[id.replace("#","").toLowerCase()] ?? id.replace("#","").toUpperCase();
}

const MSGS = [
  "INITIALIZING...", "ESTABLISHING CONNECTION...", "LOADING DATA MODULE...",
  "VERIFYING ROUTE...", "COMPILING INTERFACE...", "ROUTING USER...", "ACCESS GRANTED",
];

// ── Data Core ─────────────────────────────────────────────────────────────────
function DataCore({ active, acc }: { active: boolean; acc: string }) {
  const rings = [
    { r: 96, dash: "8 6", dir: 1, spd: "8s", opacity: "28" },
    { r: 72, dash: "4 10", dir: -1, spd: "5s", opacity: "20" },
    { r: 50, dash: "none", dir: 1, spd: "12s", opacity: "35" },
  ];
  const outerNodes = [0, 72, 144, 216, 288];
  const innerNodes = [36, 108, 180, 252, 324];

  return (
    <svg width="240" height="240" viewBox="0 0 240 240" fill="none" aria-hidden="true" style={{ display: "block" }}>
      {/* Static outer faint ring */}
      <circle cx="120" cy="120" r="110" stroke={`${acc}0D`} strokeWidth="1" />
      {/* Rotating rings */}
      {rings.map((ring, i) => (
        <circle key={i} cx="120" cy="120" r={ring.r}
          stroke={`${acc}${ring.opacity}`} strokeWidth="0.8"
          strokeDasharray={ring.dash === "none" ? undefined : ring.dash}
          style={{ transformOrigin: "120px 120px", animation: active ? `spin${ring.dir > 0 ? "Fwd" : "Rev"} ${ring.spd} linear infinite` : "none" }}
        />
      ))}
      {/* Charge arc — animates to full circle */}
      <circle cx="120" cy="120" r="96"
        stroke={acc} strokeWidth="1.8" strokeLinecap="round"
        strokeDasharray={active ? "603 0" : "0 603"}
        strokeOpacity="0.65"
        style={{ transformOrigin: "120px 120px", transform: "rotate(-90deg)", transition: "stroke-dasharray 1.4s ease-out" }}
      />
      {/* Outer nodes */}
      {outerNodes.map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <g key={i}>
            <circle cx={120 + 96 * Math.cos(r)} cy={120 + 96 * Math.sin(r)} r="3.5"
              fill={acc} opacity={active ? 0.85 : 0}
              style={{ transition: `opacity 0.3s ${i * 0.08}s` }} />
            <line x1="120" y1="120" x2={120 + 50 * Math.cos(r)} y2={120 + 50 * Math.sin(r)}
              stroke={`${acc}20`} strokeWidth="0.8"
              opacity={active ? 1 : 0} style={{ transition: `opacity 0.4s ${i * 0.1}s` }} />
          </g>
        );
      })}
      {/* Inner nodes */}
      {innerNodes.map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <circle key={i} cx={120 + 50 * Math.cos(r)} cy={120 + 50 * Math.sin(r)} r="2"
            fill={`${acc}99`} opacity={active ? 0.7 : 0}
            style={{ transition: `opacity 0.3s ${i * 0.07 + 0.2}s` }} />
        );
      })}
      {/* Center glow */}
      <circle cx="120" cy="120" r="14" fill={acc}
        opacity={active ? 0.12 : 0} style={{ transition: "opacity 0.5s", filter: "blur(6px)" }} />
      <circle cx="120" cy="120" r="5.5" fill={acc}
        opacity={active ? 0.9 : 0} style={{ transition: "opacity 0.4s 0.1s" }} />
      <circle cx="120" cy="120" r="2.5" fill="#ffffff"
        opacity={active ? 1 : 0} style={{ transition: "opacity 0.3s 0.15s" }} />
    </svg>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
interface Props { accent?: string; duration?: number; }

export function PageTransition({ accent = "#00E5FF", duration = 1800 }: Props) {
  const [state, setState] = useState<TState>("idle");
  const [dest, setDest] = useState("");
  const [label, setLabel] = useState("");
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);
  const [coreOn, setCoreOn] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const rafId = useRef<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const T = (fn: ()=>void, ms: number) => { const id = setTimeout(fn, ms); timers.current.push(id); };
  const cleanup = useCallback(() => {
    timers.current.forEach(clearTimeout); timers.current = [];
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; }
  }, []);

  const trigger = useCallback((targetId: string) => {
    if (busy.current) return;
    // Don't transition if already at top / hero
    const lbl = getLabel(targetId);
    busy.current = true;
    cleanup();
    setDest(targetId); setLabel(lbl);
    setProgress(0); setMsgIdx(0); setCoreOn(false);
    setState("active");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      T(() => {
        setState("exiting");
        T(() => {
          setState("idle"); busy.current = false;
          document.getElementById(targetId)?.scrollIntoView({ behavior: "auto" });
        }, 150);
      }, 350);
      return;
    }

    // Slight delay so React paints the overlay first
    T(() => {
      if (overlayRef.current) gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power2.out" });
      T(() => setCoreOn(true), 80);

      // Progress animation
      const activeDur = duration - 350;
      const start = performance.now();
      const tick = () => {
        const pct = Math.min(100, Math.round(((performance.now() - start) / activeDur) * 100));
        setProgress(pct);
        if (pct < 100) rafId.current = requestAnimationFrame(tick);
      };
      rafId.current = requestAnimationFrame(tick);

      // Cycle messages
      MSGS.forEach((_, i) => { if (i > 0) T(() => setMsgIdx(i), Math.round((activeDur / MSGS.length) * i)); });

      // Exit
      T(() => {
        setState("exiting");
        if (contentRef.current) gsap.to(contentRef.current, { opacity: 0, scale: 1.03, duration: 0.22, ease: "power2.in" });
        if (overlayRef.current) gsap.to(overlayRef.current, {
          opacity: 0, duration: 0.28, delay: 0.18, ease: "power2.in",
          onComplete: () => {
            setState("idle"); busy.current = false; setCoreOn(false); setProgress(0);
            document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
          }
        });
      }, activeDur + 60);
    }, 16);
  }, [duration, cleanup]);

  // Global click interception
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (!href.startsWith("#") || href === "#" || href === "#hero") return;
      e.preventDefault();
      e.stopPropagation();
      trigger(href.replace("#", ""));
    };
    // Use capture so we intercept before any other handler
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [trigger]);

  // Expose globally for manual use
  useEffect(() => {
    (window as any).__triggerTransition = (id: string) => trigger(id);
    return () => { delete (window as any).__triggerTransition; };
  }, [trigger]);

  useEffect(() => () => cleanup(), [cleanup]);

  if (state === "idle") return null;

  const acc = accent;

  return (
    <>
      <style>{`
        @keyframes spinFwd { to { transform: rotate(360deg); } }
        @keyframes spinRev { to { transform: rotate(-360deg); } }
        @keyframes scanMove { from { top: -2px; } to { top: 100%; } }
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes flicker { 0%,100%{opacity:1} 40%{opacity:0.25} 60%{opacity:0.8} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        @keyframes glitch {
          0%,90%,100%{transform:none;opacity:1}
          92%{transform:translateX(3px) skewX(-1deg);opacity:0.8}
          94%{transform:translateX(-2px);opacity:1}
          96%{transform:translateX(1px) skewX(0.5deg);opacity:0.9}
        }
        @keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
      `}</style>

      <div ref={overlayRef} role="status" aria-live="polite" aria-label={`Navigating to ${label}`}
        style={{ position: "fixed", inset: 0, zIndex: 9999, backgroundColor: "#030507", overflow: "hidden", fontFamily: "Space Grotesk, sans-serif", userSelect: "none" }}>

        {/* Dot grid */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle, ${acc}14 1px, transparent 1px)`, backgroundSize: "44px 44px", opacity: 0.7 }} />
        {/* Top accent line */}
        <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent 0%, ${acc}70 50%, transparent 100%)` }} />
        {/* Scan line */}
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${acc}55, transparent)`, animation: "scanMove 2.2s linear infinite", pointerEvents: "none" }} />

        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} aria-hidden="true" style={{
            position: "absolute",
            left: `${8 + i * 7.5}%`, top: `${15 + (i % 5) * 15}%`,
            width: i % 3 === 0 ? 2.5 : 1.5, height: i % 3 === 0 ? 2.5 : 1.5,
            borderRadius: "50%", backgroundColor: acc,
            opacity: 0.15 + (i % 4) * 0.06,
            animation: `floatUp ${4 + i * 0.6}s ${i * 0.35}s ease-in-out infinite`,
          }} />
        ))}

        {/* Corner brackets */}
        {[
          { top: 24, left: 24, borderTop: `1.5px solid ${acc}`, borderLeft: `1.5px solid ${acc}` },
          { top: 24, right: 24, borderTop: `1.5px solid ${acc}`, borderRight: `1.5px solid ${acc}` },
          { bottom: 24, left: 24, borderBottom: `1.5px solid ${acc}`, borderLeft: `1.5px solid ${acc}` },
          { bottom: 24, right: 24, borderBottom: `1.5px solid ${acc}`, borderRight: `1.5px solid ${acc}` },
        ].map((s, i) => (
          <div key={i} aria-hidden="true" style={{ position: "absolute", width: 22, height: 22, ...s }} />
        ))}

        {/* Edge labels — desktop only */}
        {["SYS.01","NODE_07","DATA_STREAM","AUTH_204"].map((lbl, i) => (
          <div key={lbl} aria-hidden="true" style={{ position: "absolute", left: 52, top: 100 + i * 58, fontSize: "0.5rem", letterSpacing: "0.14em", color: `${acc}40`, animation: `flicker ${2 + i * 0.8}s ${i * 0.3}s infinite`, display: "var(--edge-display, block)" }}>{lbl}</div>
        ))}
        {["CPU_OK","MEM_64","LATENCY","ONLINE"].map((lbl, i) => (
          <div key={lbl} aria-hidden="true" style={{ position: "absolute", right: 52, top: 100 + i * 58, fontSize: "0.5rem", letterSpacing: "0.14em", color: `${acc}40`, textAlign: "right", animation: `flicker ${2.3 + i * 0.6}s ${i * 0.4}s infinite` }}>{lbl}</div>
        ))}

        {/* ── Main Content ── */}
        <div ref={contentRef} style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "2rem" }}>

          {/* TOP LEFT — branding */}
          <div style={{ position: "absolute", top: 32, left: 52, animation: "fadeSlideUp 0.4s ease-out both" }}>
            <p style={{ fontSize: "0.52rem", letterSpacing: "0.2em", color: `${acc}70`, marginBottom: "0.3rem" }}>PORTFOLIO SYSTEM</p>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.1em", color: "#F2F2F2" }}>ALFRED OFORI</p>
            <p style={{ fontSize: "0.5rem", letterSpacing: "0.14em", color: `${acc}55`, marginTop: "0.2rem" }}>DATA · CODE · ANALYTICS</p>
          </div>

          {/* BOTTOM LEFT — status */}
          <div style={{ position: "absolute", bottom: 32, left: 52, animation: "fadeSlideUp 0.4s 0.15s ease-out both" }}>
            <p style={{ fontSize: "0.5rem", letterSpacing: "0.14em", color: `${acc}55`, marginBottom: "0.3rem" }}>SYSTEM STATUS</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 6px #22c55e", display: "inline-block", animation: "pulseDot 1.8s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", color: "#22c55e" }}>ONLINE</span>
            </div>
          </div>

          {/* BOTTOM RIGHT — destination */}
          <div style={{ position: "absolute", bottom: 32, right: 52, textAlign: "right", animation: "fadeSlideUp 0.4s 0.2s ease-out both" }}>
            <p style={{ fontSize: "0.5rem", letterSpacing: "0.14em", color: `${acc}55`, marginBottom: "0.3rem" }}>DESTINATION</p>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", color: acc }}>{label}</p>
          </div>

          {/* ── CENTER ── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.75rem" }}>

            {/* Data core */}
            <div style={{ position: "relative" }}>
              <DataCore active={coreOn} acc={acc} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <div style={{ width: coreOn ? 100 : 0, height: coreOn ? 100 : 0, borderRadius: "50%", background: `radial-gradient(circle, ${acc}14 0%, transparent 70%)`, transition: "width 0.7s, height 0.7s" }} />
              </div>
            </div>

            {/* ROUTING TO label */}
            <div style={{ textAlign: "center", animation: "fadeSlideUp 0.5s 0.1s ease-out both" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.25em", color: `${acc}65`, marginBottom: "0.6rem" }}>ROUTING TO</p>
              <p style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 700, letterSpacing: "0.1em", color: "#F2F2F2", animation: "glitch 4s 0.5s ease-in-out infinite" }}>
                {label}
              </p>
            </div>

            {/* System message */}
            <p key={msgIdx} style={{ fontSize: "0.58rem", letterSpacing: "0.18em", color: `${acc}55`, animation: "fadeSlideUp 0.25s ease-out both" }} aria-live="off">
              {MSGS[msgIdx]}
            </p>

            {/* Progress bar */}
            <div style={{ width: "clamp(220px,38vw,340px)", animation: "fadeSlideUp 0.5s 0.2s ease-out both" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.55rem", alignItems: "baseline" }}>
                <span style={{ fontSize: "0.52rem", letterSpacing: "0.15em", color: `${acc}55` }}>LOADING</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", color: acc, fontVariantNumeric: "tabular-nums" }}>
                  {String(progress).padStart(3,"0")}%
                </span>
              </div>
              {/* Track */}
              <div style={{ height: 1.5, background: `${acc}18`, borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${acc}70,${acc})`, boxShadow: `0 0 10px ${acc}`, borderRadius: 999, transition: "width 0.06s linear" }} />
              </div>
              {/* Tick marks */}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem" }}>
                {["000","025","050","075","100"].map(v => (
                  <span key={v} style={{ fontSize: "0.42rem", color: `${acc}30`, letterSpacing: "0.05em" }}>{v}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default PageTransition;