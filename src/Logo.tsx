export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Alfred Ofori logo mark">
      <polygon points="20,2 35,10.5 35,29.5 20,38 5,29.5 5,10.5" stroke="rgba(0,229,255,0.15)" strokeWidth="0.8" fill="none" />
      <line x1="12" y1="33" x2="20" y2="9" stroke="#00E5FF" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="20" y1="9" x2="28" y2="33" stroke="#00E5FF" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="14.5" y1="24" x2="25.5" y2="24" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="9" r="2" fill="#00E5FF" />
      <circle cx="14.5" cy="24" r="1.4" fill="none" stroke="#00E5FF" strokeWidth="1.2" />
      <circle cx="25.5" cy="24" r="1.4" fill="none" stroke="#00E5FF" strokeWidth="1.2" />
      <polyline points="28,33 31,33 31,28 34,28" stroke="rgba(0,229,255,0.5)" strokeWidth="1" strokeLinecap="round" fill="none" />
      <circle cx="34" cy="28" r="1" fill="#00E5FF" opacity="0.7" />
    </svg>
  );
}

export function LogoWordmark({ size = 36 }: { size?: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
      <LogoMark size={size} />
      <span style={{ fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, fontSize: size * 0.44, letterSpacing: "0.06em", color: "#F5F5F5", lineHeight: 1 }}>
        ALFRED<span style={{ color: "#00E5FF" }}>.</span>
      </span>
    </span>
  );
}