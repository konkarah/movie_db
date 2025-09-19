'use client'

import { ThemeProvider } from "next-themes"

const Providers = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
      themes={['light', 'dark', 'system']}
      storageKey="cine-scope-theme"
    >
      {children}
    </ThemeProvider>
  )
}

export default Providers