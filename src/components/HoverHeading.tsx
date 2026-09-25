/**
 * HoverHeading.tsx
 * Per-letter hover float animation on headings.
 * Words are wrapped in white-space:nowrap containers so letters
 * NEVER break mid-word on any screen size.
 */
import { useState } from "react";

interface HoverHeadingProps {
  text: string;
  text2?: string;
  accent?: string;
  color?: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2";
  className?: string;
}

export function HoverHeading({
  text,
  text2,
  accent = "#00E5FF",
  color = "#F5F5F5",
  style = {},
  as: Tag = "h2",
  className = "",
}: HoverHeadingProps) {
  const [hovered, setHovered] = useState(false);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Render a single line: split into WORDS, each word into letters.
  // Each word is wrapped in white-space:nowrap so it never breaks mid-word.
  const renderLine = (str: string, isAccent: boolean, globalOffset: number) => {
    const words = str.split(" ");
    let letterIdx = globalOffset;

    return words.map((word, wi) => {
      const wordStart = letterIdx;
      const letters = word.split("").map((char, ci) => {
        const idx = wordStart + ci;
        return (
          <span
            key={idx}
            aria-hidden="true"
            style={{
              display: "inline-block",
              color: isAccent ? accent : color,
              transition: !reduced
                ? `transform 0.35s cubic-bezier(0.22,1,0.36,1) ${idx * 16}ms, text-shadow 0.25s ease`
                : undefined,
              transform: hovered && !reduced ? "translateY(-5px) scale(1.05)" : "translateY(0) scale(1)",
              textShadow: hovered && !reduced
                ? isAccent
                  ? `0 0 20px ${accent}cc, 0 0 36px ${accent}44`
                  : `0 0 14px ${accent}44`
                : "none",
            }}
          >
            {char}
          </span>
        );
      });

      letterIdx += word.length + 1; // +1 for space

      return (
        <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
          {letters}
          {/* Space after word — except last word */}
          {wi < words.length - 1 && (
            <span style={{ display: "inline-block", width: "0.3em" }}>&nbsp;</span>
          )}
        </span>
      );
    });
  };

  const line1Len = text.split("").length + 1;

  return (
    <Tag
      className={className}
      style={{ cursor: "default", display: "block", lineHeight: "inherit", ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Screen reader */}
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
        {text}{text2 ? " " + text2 : ""}
      </span>
      {/* Line 1 */}
      <span aria-hidden="true" style={{ display: "block" }}>
        {renderLine(text, false, 0)}
      </span>
      {/* Line 2 */}
      {text2 && (
        <span aria-hidden="true" style={{ display: "block" }}>
          {renderLine(text2, true, line1Len)}
        </span>
      )}
    </Tag>
  );
}

export default HoverHeading;
