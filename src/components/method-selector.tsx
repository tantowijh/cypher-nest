"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import { LockKeyhole, Shield } from "lucide-react"
import { useTranslation } from "react-i18next"

interface MethodSelectorProps {
    value: "vigenere" | "xor" | "aes" | "rsa"
    onChange: (value: "vigenere" | "xor" | "aes" | "rsa") => void
}

export function MethodSelector({ value, onChange }: MethodSelectorProps) {
    const { t } = useTranslation()

    return (
        <div className="mb-6">
            <Label className="mb-2 block">{t('methods.label')}</Label>
            <RadioGroup
                value={value}
                onValueChange={(val) => onChange(val as "vigenere" | "xor" | "aes" | "rsa")}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vigenere" id="vigenere" />
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onChange("vigenere")}
                    >
                        <Label htmlFor="vigenere" className="flex items-center gap-2 cursor-pointer">
                            <LockKeyhole className="h-4 w-4" />
                            <span>{t('methods.vigenere.label')}</span>
                        </Label>
                    </motion.div>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="xor" id="xor" />
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onChange("xor")}
                    >
                        <Label htmlFor="xor" className="flex items-center gap-2 cursor-pointer">
                            <Shield className="h-4 w-4" />
                            <span>{t('methods.xor.label')}</span>
                        </Label>
                    </motion.div>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="aes" id="aes" />
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onChange("aes")}
                    >
                        <Label htmlFor="aes" className="flex items-center gap-2 cursor-pointer">
                            <Shield className="h-4 w-4" />
                            <span>{t('methods.aes.label')}</span>
                        </Label>
                    </motion.div>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rsa" id="rsa" />
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => onChange("rsa")}
                    >
                        <Label htmlFor="rsa" className="flex items-center gap-2 cursor-pointer">
                            <Shield className="h-4 w-4" />
                            <span>{t('methods.rsa.label')}</span>
                        </Label>
                    </motion.div>
                </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground mt-2">
                {value === "vigenere"
                    ? t('methods.vigenere.description')
                    : value === "xor"
                        ? t('methods.xor.description')
                        : value === "aes"
                            ? t('methods.aes.description')
                            : t('methods.rsa.description')}
            </p>
        </div>
    )
}
