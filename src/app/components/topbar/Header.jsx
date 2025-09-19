"use client";
// Imports Start
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { Menu, X, LogIn, LogOut, Film, ChevronDown, User } from "lucide-react";
import DarkModeSwitch from "../DarkModeSwitch";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
// Imports End

const Header = () => {
  // State variables Start
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // State variables End

  // Normal Variables Start
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/favorites", label: "Favorites" },
    { href: "/about", label: "About" },


  ];
  // Normal Variables End

  // Handle scroll effect for header Start
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Handle scroll effect for header End

  // Close mobile menu when clicking outside Start
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen && !event.target.closest(".mobile-menu-container")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);
  // Close mobile menu when clicking outside End

  return (
    // Header Container Start
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-500 ease-out ${scrolled
        ? "backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-800/50"
        : "backdrop-blur-lg border-b border-gray-200/30 dark:border-gray-800/30"
        }`}
      style={{
        backgroundColor: scrolled
          ? 'color-mix(in srgb, var(--background) 85%, transparent)'
          : 'color-mix(in srgb, var(--background) 75%, transparent)'
      }}
    >
      {/* DeskTop Panel Start */}
      <section className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Start */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 py-4 group relative overflow-hidden flex-shrink-0"
        >
          {/* Film Logo Start */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative p-2 sm:p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300 group-hover:scale-110">
              <Film className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </div>
          {/* Film Logo End */}

          {/* Film Name Start */}
          <div className="flex flex-col group cursor-pointer">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight text-[var(--foreground)]">
              Cine{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:animate-pulse">
                Scope
              </span>
            </h1>
            <span className="text-xs text-[var(--foreground)] opacity-70 font-medium hidden sm:block">
              Discover Cinema
            </span>
          </div>
          {/* Film Name End */}
        </Link>
        {/* Logo End */}

        {/* Desktop Navigation Start */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-[var(--foreground)] font-medium text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-800/30 group"
              style={{ opacity: 0.8 }}
            >
              <span className="relative z-10">{item.label}</span>
              <div className="absolute inset-0 scale-0 group-hover:scale-100 bg-gradient-to-r from-indigo-50/30 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg transition-transform duration-300 ease-out"></div>
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-8 group-hover:-translate-x-4 transition-all duration-300"></div>
            </Link>
          ))}
        </nav>
        {/* Desktop Navigation End */}

        {/* Desktop Auth Start */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Dark Mode Switch Start */}
          <DarkModeSwitch />
          {/* Dark Mode Switch End */}

          {/* Clerk Authentication */}
          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-2">
              {/* Sign Up Button Start */}
              <Link href="/sign-up">
                <Button
                  label="Sign in"
                  icon={<LogIn className="w-4 h-4" />}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 text-sm"
                  text
                />
              </Link>
              {/* Sign Up Button End */}
            </div>
          </SignedOut>
        </div>
        {/* Desktop Auth End */}

        {/* Mobile Controls Start */}
        <div className="lg:hidden flex items-center gap-2 sm:gap-4">
          {/* Dark Mode Switch for Mobile */}
          <div className="flex-shrink-0">
            <DarkModeSwitch />
          </div>

          {/* Clerk Authentication for Mobile */}
          <div className="flex-shrink-0">
            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <Link href="/sign-up">
                <Button
                  label="Sign in"
                  icon={<LogIn className="w-3 h-3 sm:w-4 sm:h-4" />}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 text-xs sm:text-sm"
                  text
                />
              </Link>
            </SignedOut>
          </div>

          {/* Mobile Menu Button Start */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex-shrink-0 p-2 text-[var(--foreground)] hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/30 rounded-lg transition-all duration-300 mobile-menu-container"
            aria-label="Toggle Menu"
            style={{ opacity: 0.8 }}
          >
            <div className="relative w-5 h-5 sm:w-6 sm:h-6">
              <Menu className={`absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${menuOpen ? 'opacity-0 rotate-45' : 'opacity-100 rotate-0'}`} />
              <X className={`absolute inset-0 w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 ${menuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-45'}`} />
            </div>
          </button>
          {/* Mobile Menu Button End */}
        </div>
        {/* Mobile Controls End */}
      </section>
      {/* Desktop Panel End */}

      {/* Mobile Menu Panel Start */}
      <section className={`lg:hidden mobile-menu-container transition-all duration-500 ease-out ${menuOpen
        ? 'max-h-96 opacity-100'
        : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
        <div className="bg-[var(--background)]/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
          <nav className="flex flex-col px-4 py-6 space-y-1">
            {/* Nav Item Start */}
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-3 text-[var(--foreground)] font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 rounded-lg transition-all duration-300 transform hover:translate-x-2"
                onClick={() => setMenuOpen(false)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: menuOpen ? 'slideInLeft 0.5s ease-out forwards' : 'none',
                  opacity: 0.8
                }}
              >
                {item.label}
              </Link>
            ))}
            {/* Nav Item End */}
          </nav>
        </div>
      </section>
      {/* Mobile Menu Panel End */}

      <style jsx>{`
    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `}</style>
    </header>
    // Header Container End
  );
};

export default Header;