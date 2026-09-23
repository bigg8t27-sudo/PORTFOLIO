/**
 * IntroScreen.tsx
 * One-time boot screen shown before the portfolio loads.
 * Concept: "Entering a developer's digital hub — system booting"
 * Visually distinct from the nav PageTransition.
 *
 * Sequence:
 *  1. Screen splits into two dark halves
 *  2. Left: terminal boot lines type out one by one
 *  3. Right: hub logo assembles + "DEVELOPER HUB ONLINE" badge appears
 *  4. Progress bar fills to 100%
 *  5. Two halves slide apart (left←, right→) revealing the portfolio
 *
 * Only shows once per session (sessionStorage flag).
 */
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// ─── Boot lines ──────────────────────────────────────────────────────────────
const BOOT_LINES = [
  { text: "> INITIALIZING ALFRED.OS v2.6.0",      delay: 0,    color: "#8A8A8A" },
  { text: "> LOADING DATA MODULES...............",  delay: 200,  color: "#8A8A8A" },
  { text: "> CALIBRATING ANALYTICS ENGINE",        delay: 400,  color: "#8A8A8A" },
  { text: "> MOUNTING INTERFACE COMPONENTS [OK]",  delay: 590,  color: "#00E5FF" },
  { text: "> VERIFYING CREDENTIALS...............", delay: 760,  color: "#8A8A8A" },
  { text: "> ACCESS GRANTED",                      delay: 910,  color: "#22c55e" },
  { text: "> WELCOME, DEVELOPER",                  delay: 1060, color: "#F5F5F5" },
];

// ─── Typing line ──────────────────────────────────────────────────────────────
function TermLine({ text, color, visible }: { text: string; color: string; visible: boolean }) {
  const [chars, setChars] = useState("");
  const idx = useRef(0);

  useEffect(() => {
    if (!visible) return;
    idx.current = 0;
    setChars("");
    const iv = setInterval(() => {
      idx.current++;
      setChars(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, [visible, text]);

  if (!visible) return null;
  return (
    <div style={{ fontFamily: "monospace", fontSize: "clamp(0.5rem,1.4vw,0.68rem)", color, letterSpacing: "0.06em", lineHeight: 1.8 }}>
      {chars}
      {chars.length < text.length && (
        <span style={{ borderRight: `2px solid ${color}`, marginLeft: 1, animation: "iBlinkCursor 0.55s step-end infinite" }} />
      )}
    </div>
  );
}

// ─── Hub logo (different from nav logo) ──────────────────────────────────────
function HubLogo({ on, acc }: { on: boolean; acc: string }) {
  const nodes: [number, number][] = [
    [80, 16], [144, 48], [144, 112], [80, 144], [16, 112], [16, 48],
  ];
  const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3],[1,4],[2,5]];

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none" aria-hidden="true">
      {/* Outer ring */}
      <circle cx="80" cy="80" r="72"
        stroke={on ? `${acc}20` : "transparent"} strokeWidth="0.8"
        style={{ transition: "stroke 0.5s 0.1s" }} />
      {/* Rotating dashed mid ring */}
      <circle cx="80" cy="80" r="54"
        stroke={on ? `${acc}35` : "transparent"} strokeWidth="0.8"
        strokeDasharray="5 7" fill="none"
        style={{
          transformOrigin: "80px 80px",
          animation: on ? "iSpinFwd 10s linear infinite" : "none",
          transition: "stroke 0.4s 0.2s",
        }} />
      {/* Counter-rotating inner ring */}
      <circle cx="80" cy="80" r="34"
        stroke={on ? `${acc}25` : "transparent"} strokeWidth="0.8"
        style={{
          transformOrigin: "80px 80px",
          animation: on ? "iSpinRev 7s linear infinite" : "none",
          transition: "stroke 0.4s 0.3s",
        }} />
      {/* Edges between nodes */}
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a][0]} y1={nodes[a][1]}
          x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={on ? `${acc}30` : "transparent"}
          strokeWidth="0.7"
          style={{ transition: `stroke 0.3s ${0.25 + i * 0.05}s` }}
        />
      ))}
      {/* Nodes */}
      {nodes.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="4"
          fill={on ? acc : "transparent"}
          opacity={on ? 0.85 : 0}
          style={{ transition: `fill 0.3s ${0.3 + i * 0.06}s, opacity 0.3s ${0.3 + i * 0.06}s` }} />
      ))}
      {/* Center glow */}
      <circle cx="80" cy="80" r="10"
        fill={on ? acc : "transparent"} opacity={on ? 0.12 : 0}
        style={{ transition: "all 0.5s 0.5s", filter: "blur(4px)" }} />
      <circle cx="80" cy="80" r="5"
        fill={on ? acc : "transparent"} opacity={on ? 1 : 0}
        style={{ transition: "all 0.4s 0.55s" }} />
      <circle cx="80" cy="80" r="2.5"
        fill="#ffffff" opacity={on ? 1 : 0}
        style={{ transition: "opacity 0.3s 0.6s" }} />
    </svg>
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles({ acc }: { acc: string }) {
  const ps = Array.from({ length: 10 }, (_, i) => ({
    x: 10 + i * 8.5, y: 10 + (i % 5) * 16,
    s: i % 3 === 0 ? 2 : 1.5,
    d: 3.5 + i * 0.7, delay: i * 0.4,
  }));
  return (
    <>
      {ps.map((p, i) => (
        <div key={i} aria-hidden="true" style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s, borderRadius: "50%",
          backgroundColor: acc, opacity: 0.12 + (i % 3) * 0.05,
          animation: `iFloatPt ${p.d}s ${p.delay}s ease-in-out infinite alternate`,
        }} />
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
interface IntroScreenProps {
  onComplete: () => void;
  accent?: string;
}

export function IntroScreen({ onComplete, accent = "#00E5FF" }: IntroScreenProps) {
  const [shownLines, setShownLines] = useState<number[]>([]);
  const [logoOn, setLogoOn] = useState(false);
  const [hubOnline, setHubOnline] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  const leftRef  = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number | null>(null);
  const timers   = useRef<ReturnType<typeof setTimeout>[]>([]);

  const T = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  useEffect(() => {
    // Only show once per browser session
    const alreadyShown = sessionStorage.getItem("__intro_shown");
    if (alreadyShown) { onComplete(); return; }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      sessionStorage.setItem("__intro_shown", "1");
      T(onComplete, 400);
      return;
    }

    // Reveal boot lines
    BOOT_LINES.forEach((_, i) => {
      T(() => setShownLines(p => [...p, i]), BOOT_LINES[i].delay);
    });

    // Logo and badge
    T(() => setLogoOn(true), 1200);
    T(() => setHubOnline(true), 1450);

    // Progress bar
    T(() => {
      const start = performance.now();
      const dur = 850;
      const tick = () => {
        const pct = Math.min(100, Math.round(((performance.now() - start) / dur) * 100));
        setProgress(pct);
        if (pct < 100) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          // Start split-exit
          T(() => {
            setExiting(true);
            const tl = gsap.timeline({
              onComplete: () => {
                sessionStorage.setItem("__intro_shown", "1");
                onComplete();
              },
            });
            tl.to(leftRef.current,  { x: "-100%", duration: 0.6, ease: "power3.inOut" }, 0);
            tl.to(rightRef.current, { x:  "100%", duration: 0.6, ease: "power3.inOut" }, 0);
          }, 180);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }, 1600);

    return () => {
      timers.current.forEach(clearTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // If already shown, render nothing (onComplete called in effect)
  if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("__intro_shown")) {
    return null;
  }

  const acc = accent;

  const half: React.CSSProperties = {
    position: "fixed",
    top: 0, bottom: 0,
    width: "50%",
    backgroundColor: "#020408",
    zIndex: 10000,
    overflow: "hidden",
  };

  return (
    <>
      <style>{`
        @keyframes iBlinkCursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes iSpinFwd     { to { transform: rotate(360deg); } }
        @keyframes iSpinRev     { to { transform: rotate(-360deg); } }
        @keyframes iFloatPt     { from{transform:translateY(0)} to{transform:translateY(-10px)} }
        @keyframes iScan        { from{top:-1px} to{top:100%} }
        @keyframes iPulse       { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.35;transform:scale(0.65)} }
        @keyframes iFadeUp      { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes iFadeLeft    { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }
        @keyframes iFloat       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes iGlitch      { 0%,85%,100%{transform:none} 87%{transform:translateX(3px)} 90%{transform:translateX(-2px)} 93%{transform:none} }
      `}</style>

      {/* ── LEFT HALF — Terminal ─────────────────────────────────────────── */}
      <div ref={leftRef} style={{ ...half, left: 0 }}>
        {/* Background dot grid */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle,${acc}10 1px,transparent 1px)`, backgroundSize: "38px 38px" }} />
        {/* Scan line */}
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${acc}50,transparent)`, animation: "iScan 2.2s linear infinite" }} />
        {/* Top-left bracket */}
        <div aria-hidden="true" style={{ position: "absolute", top: 18, left: 18, width: 18, height: 18, borderTop: `1.5px solid ${acc}`, borderLeft: `1.5px solid ${acc}` }} />
        {/* Bottom-left bracket */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: 18, left: 18, width: 18, height: 18, borderBottom: `1.5px solid ${acc}`, borderLeft: `1.5px solid ${acc}` }} />
        {/* Particles */}
        <Particles acc={acc} />
        {/* Terminal lines */}
        <div style={{ position: "absolute", left: "clamp(28px,6vw,72px)", top: "clamp(56px,13vh,110px)", display: "flex", flexDirection: "column" }}>
          {BOOT_LINES.map((line, i) => (
            <div key={i} style={{ animation: shownLines.includes(i) ? "iFadeLeft 0.25s ease-out both" : "none" }}>
              <TermLine text={line.text} color={line.color} visible={shownLines.includes(i)} />
            </div>
          ))}
        </div>
        {/* Bottom status */}
        <div style={{ position: "absolute", bottom: 26, left: 28 }}>
          <p style={{ fontSize: "0.45rem", letterSpacing: "0.14em", color: `${acc}45`, fontFamily: "monospace" }}>SYS.BOOT / v2.6.0</p>
        </div>
      </div>

      {/* ── RIGHT HALF — Hub visual ──────────────────────────────────────── */}
      <div ref={rightRef} style={{ ...half, right: 0 }}>
        {/* Background dot grid */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle,${acc}08 1px,transparent 1px)`, backgroundSize: "38px 38px" }} />
        {/* Scan line offset */}
        <div aria-hidden="true" style={{ position: "absolute", left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${acc}40,transparent)`, animation: "iScan 2.6s 0.5s linear infinite" }} />
        {/* Top-right bracket */}
        <div aria-hidden="true" style={{ position: "absolute", top: 18, right: 18, width: 18, height: 18, borderTop: `1.5px solid ${acc}`, borderRight: `1.5px solid ${acc}` }} />
        {/* Bottom-right bracket */}
        <div aria-hidden="true" style={{ position: "absolute", bottom: 18, right: 18, width: 18, height: 18, borderBottom: `1.5px solid ${acc}`, borderRight: `1.5px solid ${acc}` }} />

        {/* Center content */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.25rem", padding: "2rem" }}>
          {/* Hub logo */}
          <div style={{ animation: logoOn ? "iFloat 4s ease-in-out infinite" : "none" }}>
            <HubLogo on={logoOn} acc={acc} />
          </div>

          {/* Name + tagline */}
          <div style={{ textAlign: "center", animation: "iFadeUp 0.5s 0.4s ease-out both" }}>
            <p style={{ fontSize: "clamp(1rem,2.8vw,1.4rem)", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.12em", color: "#F2F2F2", marginBottom: "0.3rem", animation: "iGlitch 5s 1s ease-in-out infinite" }}>
              ALFRED OFORI
            </p>
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", color: `${acc}75`, fontFamily: "Space Grotesk, sans-serif" }}>
              DATA · CODE · ANALYTICS
            </p>
          </div>

          {/* DEVELOPER HUB ONLINE badge */}
          {hubOnline && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: `1px solid ${acc}35`, borderRadius: "2rem", padding: "0.28rem 0.9rem", animation: "iFadeUp 0.35s ease-out both" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 6px #22c55e", display: "inline-block", animation: "iPulse 1.6s ease-in-out infinite" }} />
              <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.18em", fontFamily: "Space Grotesk, sans-serif", color: "#22c55e" }}>
                DEVELOPER HUB ONLINE
              </span>
            </div>
          )}

          {/* Progress */}
          <div style={{ width: "clamp(150px,75%,240px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.45rem", letterSpacing: "0.14em", color: `${acc}45`, fontFamily: "monospace" }}>INITIALIZING</span>
              <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.06em", color: acc, fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}>
                {String(progress).padStart(3, "0")}%
              </span>
            </div>
            <div style={{ height: 1.5, background: `${acc}15`, borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${acc}65,${acc})`, boxShadow: `0 0 8px ${acc}`, borderRadius: 999, transition: "width 0.06s linear" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
              {["000","025","050","075","100"].map(v => (
                <span key={v} style={{ fontSize: "0.38rem", color: `${acc}25`, fontFamily: "monospace" }}>{v}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom right label */}
        <div style={{ position: "absolute", bottom: 26, right: 28, textAlign: "right" }}>
          <p style={{ fontSize: "0.45rem", letterSpacing: "0.14em", color: `${acc}45`, fontFamily: "monospace" }}>ENTERING PORTFOLIO</p>
        </div>
      </div>

      {/* Center seam glow */}
      <div aria-hidden="true" style={{
        position: "fixed", top: 0, bottom: 0,
        left: "calc(50% - 1px)", width: 2, zIndex: 10001,
        background: `linear-gradient(to bottom, transparent, ${acc}90 20%, ${acc}90 80%, transparent)`,
        opacity: exiting ? 0 : 0.8, transition: "opacity 0.3s",
        pointerEvents: "none",
      }} />
    </>
  );
}

export default IntroScreen;
