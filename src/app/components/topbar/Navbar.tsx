import React from "react";
import NavbarItem from "./NavbarItem";

const Navbar = () => {
  return (
    <nav className="fixed top-16 left-0 right-0 z-40 w-full"> {/* Changed from sticky to fixed, added top-16 */}
      {/* Enhanced Background with better blur */}
      <div
        className="backdrop-blur-2xl border-b shadow-lg transition-all duration-300"
        style={{
          background: "linear-gradient(to bottom, var(--background)/95, var(--background)/98)",
          borderColor: "var(--border)",
        }}
      >
        {/* Container with better spacing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-6">
            {/* Enhanced Navigation Pills Container */}
            <div className="relative group">
              {/* Glow Effect Background */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
              
              {/* Main Container */}
              <div
                className="relative flex items-center rounded-2xl p-2 shadow-lg backdrop-blur-sm border transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Inner glow */}
                <div className="absolute inset-1 rounded-xl bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-pink-50/50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Navigation Items */}
                <div className="relative flex items-center">
                  <NavbarItem title="Trending" param="trending" />
                  <NavbarItem title="Top Rated" param="rated" />
                </div>
              </div>

              {/* Floating particles effect */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-indigo-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-ping transition-opacity duration-300" />
              <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-0 group-hover:opacity-40 group-hover:animate-ping transition-opacity duration-500" />
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div 
          className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-50"
        />
      </div>
    </nav>
  );
};

export default Navbar;