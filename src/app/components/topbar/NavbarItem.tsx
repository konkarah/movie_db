"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { TrendingUp, Star } from "lucide-react";

interface NavbarItemProps {
  title: string;
  param: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ title, param }) => {
  const pathname = usePathname();
  const genre = pathname.split("/")[2];
  const isActive = genre === param;

  const getIcon = () => {
    switch (param) {
      case "trending":
        return <TrendingUp className="w-3.5 h-3.5" />;
      case "rated":
        return <Star className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <Link href={`/top/${param}`}>
      <div
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 group`}
        style={{
          backgroundColor: isActive
            ? "var(--background)"
            : "transparent",
          color: isActive
            ? "var(--foreground)"
            : "var(--foreground)",
          border: isActive
            ? `1px solid var(--border)`
            : `1px solid transparent`,
        }}
      >
        {/* Icon */}
        <div
          className={`flex-shrink-0 flex items-center justify-center transition-all duration-300`}
          style={{
            color: isActive ? "var(--foreground)" : "var(--foreground)",
          }}
        >
          {getIcon()}
        </div>

        {/* Title */}
        <h1
          className="text-xs font-semibold tracking-wide flex items-center transition-all duration-300"
          style={{
            color: isActive ? "var(--foreground)" : "var(--foreground)",
          }}
        >
          {title}
        </h1>

        {/* Active indicator dot */}
        {isActive && (
          <div
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-pulse"
            style={{
              background: "linear-gradient(to right, #6366F1, #A78BFA)",
            }}
          />
        )}

        {/* Subtle glow effect for active state */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-full animate-pulse"
            style={{
              background: "linear-gradient(to right, #6366F133, #A78BFA33)",
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default NavbarItem;
