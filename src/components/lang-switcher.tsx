"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import i18n from "@/utils/i18n"

export function LangSwitcher() {
    const [language, setLanguage] = React.useState(i18n.language)

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang)
            .then(() => {
                setLanguage(lang) // Update local state after language change
            })
            .catch((error) => {
                console.error("Failed to change language:", error)
            })
    }

    React.useEffect(() => {
        const handleLanguageChanged = (lng: string) => {
            setLanguage(lng) // Sync state with i18next
        }

        i18n.on("languageChanged", handleLanguageChanged)
        return () => {
            i18n.off("languageChanged", handleLanguageChanged)
        }
    }, [])

    React.useEffect(() => {
    }, [language])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default" size="sm" className="flex items-center gap-2">
                    {language === "en" ? "🇬🇧 English" : "🇮🇩 Indonesian"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
                <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
                    🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLanguageChange("id")}>
                    🇮🇩 Indonesian
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}