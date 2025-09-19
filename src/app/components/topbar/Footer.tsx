"use client";

// Imports Start
import React from "react";
import Link from "next/link";
import { Film, Heart } from "lucide-react";
// Imports End

const Footer = () => {
  // Current Year Start
  const currentYear = new Date().getFullYear();
  // Current Year End

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Footer Content Start */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand Start */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div className="mt-4">
              <h1 className="font-black text-[var(--foreground)]">
                Cine
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  Scope
                </span>
              </h1>
              <p className="!text-[12px] text-[var(--foreground)] opacity-70">
                Discover Cinema
              </p>
            </div>
          </div>
          {/* Brand End */}

          {/* Links Start*/}
          <div className="flex items-center gap-6 text-sm text-[var(--foreground)] opacity-80">
            <Link href="/about" className="hover:opacity-100 transition-opacity">
              About
            </Link>
            <Link href="/privacy" className="hover:opacity-100 transition-opacity">
              Privacy
            </Link>
            <Link href="/terms" className="hover:opacity-100 transition-opacity">
              Terms
            </Link>
            <Link href="/contact" className="hover:opacity-100 transition-opacity">
              Contact
            </Link>
          </div>
          {/* Links End */}

          {/* Copyright Start */}
          <div className="flex items-center gap-2 text-sm text-[var(--foreground)] opacity-70">
            <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
            <span>© {currentYear} Cinescope</span>
          </div>
          {/* Copyright End */}
        </div>
        {/* Main Footer Content End */}

        {/* Bottom Attribution Start */}
        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          {/* full-width wrapper to ensure proper centering */}
          <div className="w-full flex justify-center">
            <p className="text-xs text-[var(--foreground)] opacity-60 text-center max-w-none flex items-center gap-2">
              Developed with
              <Heart className="w-3 h-3 text-pink-500 animate-bounce" />
              by
              <Link
                href="https://www.linkedin.com/in/emmanuel-koech-79368b21a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline hover:opacity-90 transition-opacity ml-1"
              >
                Emmanuel
              </Link>
            </p>
          </div>
        </div>
        {/* Bottom Attribution End */}
      </div>
    </footer>
  );
};

export default Footer;
