import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center gap-2 animate-bounce">
      <p className="text-xs font-grotesk tracking-widest text-text-secondary">
        SCROLL TO EXPLORE
      </p>
      <ChevronDown size={20} className="text-accent" />
    </div>
  );
};
