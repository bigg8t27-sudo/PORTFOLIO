import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  className?: string;
  showArrow?: boolean;
  external?: boolean;
  disabled?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  showArrow = true,
  external = false,
  disabled = false,
}: ButtonProps) => {
  const baseStyles =
    "font-grotesk font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group";

  const variants = {
    primary:
      "bg-accent text-background hover:bg-accent-dark active:scale-95 disabled:opacity-50",
    secondary:
      "border border-accent text-accent hover:bg-accent hover:text-background active:scale-95 disabled:opacity-50",
    ghost: "text-text-primary hover:text-accent disabled:opacity-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded",
    md: "px-6 py-3 text-base rounded-lg",
    lg: "px-8 py-4 text-lg rounded-lg",
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const content = (
    <>
      {children}
      {showArrow && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
};
