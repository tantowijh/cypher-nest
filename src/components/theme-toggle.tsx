"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Monitor, Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="inline-flex items-center border border-border rounded-md overflow-hidden">
            <Button
                variant={theme === "light" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTheme("light")}
                className="rounded-none"
            >
                <motion.div
                    whileTap={{ scale: 0.8, opacity: 0.8 }}
                    transition={{ duration: 0.5 }}
                    key={theme}
                >
                    <Sun className="h-5 w-5" />
                    <span className="sr-only">Light Theme</span>
                </motion.div>
            </Button>
            <Button
                variant={theme === "dark" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTheme("dark")}
                className="rounded-none"
            >
                <motion.div
                    whileTap={{ scale: 0.8, opacity: 0.8 }}
                    transition={{ duration: 0.5 }}
                    key={theme}
                >
                    <Moon className="h-5 w-5" />
                    <span className="sr-only">Dark Theme</span>
                </motion.div>
            </Button>
            <Button
                variant={theme === "system" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTheme("system")}
                className="rounded-none"
            >
                <motion.div
                    whileTap={{ scale: 0.8, opacity: 0.8 }}
                    transition={{ duration: 0.5 }}
                    key={theme}
                >
                    <Monitor className="h-5 w-5" />
                    <span className="sr-only">System Theme</span>
                </motion.div>
            </Button>
        </motion.div>
    )
}
