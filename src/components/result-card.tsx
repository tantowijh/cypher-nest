"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, X } from "lucide-react"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"

interface ResultCardProps {
    title: string
    text: string
    onClear: () => void
}

export function ResultCard({ title, text, onClear }: ResultCardProps) {
    const [copied, setCopied] = useState(false)
    const { t } = useTranslation()

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            toast.success(t("functionalities.copy.success"))
            setTimeout(() => setCopied(false), 2000)
        } catch {
            toast.error(t("functionalities.copy.error"))
        }
    }

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
          <Card className="backdrop-blur-md bg-opacity-50 border-opacity-30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                {title}
                <Button variant="ghost" size="icon" onClick={onClear}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-3 rounded-md overflow-auto max-h-[200px]">
                <pre className="text-sm whitespace-pre-wrap break-words">{text}</pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto flex gap-1" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{t("functionalities.copy.label.after")}</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>{t("functionalities.copy.label.before")}</span>
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )
}
