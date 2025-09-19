"use client"

// Imports Start
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from "lucide-react";
// Imports End

const DarkModeSwitch = () => {

  // State Variables Start
  const [mounted, setMounted] = useState(false);
  // State Variables End

  // Theme Hook Start
  const { theme, setTheme, systemTheme } = useTheme();
  // Theme Hook End

  // Determine current theme Start
  const currentTheme = theme === 'system' ? systemTheme : theme;
  // Determine current theme End

  // When mounted on client, now we can show the UI Start
  useEffect(() => setMounted(true), []);
  // When mounted on client, now we can show the UI End

  // If not mounted, do not render anything Start
  if (!mounted) return null;
  // If not mounted, do not render anything End

  return (
// Switch Button Start
<button
  onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
  className="p-2 rounded-lg transition-all duration-300 ease-in-out"
  aria-label="Toggle theme"
>
  {currentTheme === 'dark' ? (
    // Sun Icon for Light Mode Start
    <div className="p-2 rounded-full hover:bg-amber-100 transition-all duration-300 ease-in-out">
      <Sun className="w-6 h-6 text-amber-500 transform transition-transform duration-300 hover:rotate-12 hover:scale-110" />
    </div>
    // Sun Icon for Light Mode End
  ) : (
    // Moon Icon for Dark Mode Start
    <div className="p-2 rounded-full hover:bg-indigo-100 transition-all duration-300 ease-in-out">
      <Moon className="w-6 h-6 text-slate-600 transform transition-transform duration-300 hover:rotate-12 hover:scale-110" />
    </div>
    // Moon Icon for Dark Mode End
  )}
</button>
// Switch Button End




  )
}

export default DarkModeSwitch