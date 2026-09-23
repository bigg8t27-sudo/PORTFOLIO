/**
 * HoverHeading.tsx
 * Wraps any heading text so each letter floats up independently on hover.
 * Staggered per-letter animation — pure CSS transitions, no library.
 * Respects prefers-reduced-motion.
 */
import { useState } from "react";

interface HoverHeadingProps {
  /** The text content */
  text: string;
  /** Optional second line (rendered on new line) */
  text2?: string;
  /** accent color for the second line / glow */
  accent?: string;
  /** base text color */
  color?: string;
  /** all other style props passed to the wrapper */
  style?: React.CSSProperties;
  /** HTML tag — h1 or h2 */
  as?: "h1" | "h2";
  /** extra className */
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

  // Split text into individual letters, preserving spaces
  const renderLetters = (str: string, isAccent = false, lineOffset = 0) =>
    str.split("").map((char, i) => {
      const idx = lineOffset + i;
      const isSpace = char === " ";

      if (isSpace) {
        return (
          <span key={idx} style={{ display: "inline-block", width: "0.28em" }}>
            &nbsp;
          </span>
        );
      }

      return (
        <span
          key={idx}
          aria-hidden="true"
          style={{
            display: "inline-block",
            color: isAccent ? accent : color,
            transition: !reduced
              ? `transform 0.35s cubic-bezier(0.22,1,0.36,1) ${idx * 18}ms,
                 color 0.25s ease,
                 text-shadow 0.25s ease`
              : undefined,
            transform:
              hovered && !reduced
                ? `translateY(-6px) scale(1.06)`
                : "translateY(0) scale(1)",
            textShadow:
              hovered && !reduced
                ? isAccent
                  ? `0 0 22px ${accent}cc, 0 0 40px ${accent}55`
                  : `0 0 16px ${accent}55`
                : "none",
          }}
        >
          {char}
        </span>
      );
    });

  return (
    <Tag
      className={className}
      style={{
        cursor: "default",
        display: "block",
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Screen-reader text */}
      <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
        {text}{text2 ? " " + text2 : ""}
      </span>
      {/* Visual letters */}
      <span aria-hidden="true" style={{ display: "block" }}>
        {renderLetters(text, false, 0)}
      </span>
      {text2 && (
        <span aria-hidden="true" style={{ display: "block" }}>
          {renderLetters(text2, true, text.length + 1)}
        </span>
      )}
    </Tag>
  );
}

export default HoverHeading;
