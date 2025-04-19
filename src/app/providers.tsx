"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster position="top-right" />
      {children}
    </ThemeProvider>
  )
}
