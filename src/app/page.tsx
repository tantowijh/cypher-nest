"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EncryptForm } from "@/components/encrypt-form"
import { DecryptForm } from "@/components/decrypt-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Lock, Unlock } from "lucide-react"
import { LangSwitcher } from "@/components/lang-switcher"
import { Trans, useTranslation } from "react-i18next"

export default function Home() {
  const [activeTab, setActiveTab] = useState("encrypt")
  const technology = "Python"
  const { t } = useTranslation()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center pt-20 sm:pt-24 md:pt-28 p-4 sm:p-6 md:p-8 bg-gradient-to-br from-background to-muted/50">
      <div className="absolute top-4 flex items-center gap-2 backdrop-blur-md bg-card/50 p-2 rounded-lg shadow-md z-10">
        <LangSwitcher />
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight">{t("app.name")}</h1>
        <p className="text-muted-foreground mt-2">
          {t("app.description", { technology })}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="backdrop-blur-xl bg-card/30 border border-border/30 rounded-xl shadow-lg p-6">
          <Tabs defaultValue="encrypt" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6 w-full">
              <TabsTrigger value="encrypt" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>
                  <Trans i18nKey="functionalities.encrypt.label" />
                </span>
              </TabsTrigger>
              <TabsTrigger value="decrypt" className="flex items-center gap-2">
                <Unlock className="h-4 w-4" />
                <span>
                  <Trans i18nKey="functionalities.decrypt.label" />
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent key="encrypt" value="encrypt" className="mt-0">
              <EncryptForm />
            </TabsContent>
            <TabsContent key="decrypt" value="decrypt" className="mt-0">
              <DecryptForm />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        <p>
          {t("footer.builtBy", { team: "Kelompok 5" })}
        </p>
        <p className="mt-1">
          <Trans
            i18nKey="footer.poweredBy"
            values={{ technology: "Python", framework: "TailwindCSS" }}
            components={{
              strong: <strong />,
            }}
          />
        </p>
        <p className="mt-1">
          {t("footer.copyright", { year: new Date().getFullYear(), team: "Kelompok 5" })}
        </p>
      </motion.footer>
    </main>
  )
}
