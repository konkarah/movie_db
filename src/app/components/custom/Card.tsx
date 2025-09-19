// Imports Start
import React, { ReactNode, HTMLAttributes } from "react";
// Imports End

// Props Type Start
type CardProps = {
  children: ReactNode;
  className?: string; // ✅ allow className to be passed
} & HTMLAttributes<HTMLElement>; // optional, for other props like id, style
// Props Type End

const Card = ({ children, className = "", ...props }: CardProps) => {
  return (
    <section
      className={`rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300 border ${className}`}
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        borderColor: "var(--border)",
      }}
      {...props} // forward any other props
    >
      {children}
    </section>
  );
};

export default Card;
