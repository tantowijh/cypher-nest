"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { ResultCard } from "@/components/result-card"
import { MethodSelector } from "@/components/method-selector"
import axios from "axios"
import { useTranslation } from "react-i18next"

export function EncryptForm() {
    const [plaintext, setPlaintext] = useState("")
    const [keyword, setKeyword] = useState("")
    const [ciphertext, setCiphertext] = useState("")
    const [showResult, setShowResult] = useState(false)
    const [method, setMethod] = useState<"vigenere" | "xor" | "aes" | "rsa">("vigenere") // Include AES and RSA
    const [keyLength, setKeyLength] = useState(0)
    const { t } = useTranslation()
    
    const handleEncrypt = async () => {
        try {
            if (!plaintext.trim()) {
                toast.error(t('functionalities.encrypt.errors.plaintext.empty'))
                return
            }

            if (method !== "rsa" && !keyword.trim()) {
                toast.error(t('functionalities.encrypt.errors.keyword.empty'))
                return
            }

            if (method === "aes" && keyword.length !== 16) {
                toast.error(t('functionalities.encrypt.errors.keyword.aes'))
                return
            }

            // Make a POST request to the backend API
            const response = await axios.post("/api/encrypt", {
                plaintext,
                keyword: method === "rsa" ? undefined : keyword, // RSA doesn't need a keyword
                method,
            })

            // Extract the encrypted text from the response
            const { encrypted } = response.data
            setCiphertext(encrypted)
            setShowResult(true)
            toast.success(t('functionalities.encrypt.success'))
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.detail || t('functionalities.encrypt.errors.general'))
            } else {
                toast.error(t('functionalities.encrypt.errors.unknown'))
            }
        }
    }

    const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setKeyword(value)
        if (method === "aes") {
            setKeyLength(value.length)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            <MethodSelector value={method} onChange={setMethod} />

            <div className="space-y-2">
                <Label htmlFor="plaintext">{ t('inputs.plaintext.label') }</Label>
                <Textarea
                    id="plaintext"
                    placeholder={t('inputs.plaintext.placeholder')}
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                    className="min-h-[120px] backdrop-blur-sm bg-opacity-20 border-opacity-20"
                />
            </div>

            {method !== "rsa" && (
                <div className="space-y-2">
                    <Label htmlFor="keyword">
                        {method === "vigenere" ? t('keywords.vigenere.label') : method === "aes" ? t('keywords.aes.label') : t('keywords.xor.label')}
                    </Label>
                    <Input
                        id="keyword"
                        placeholder={
                            method === "vigenere"
                                ? t('keywords.vigenere.placeholder')
                                : method === "aes"
                                    ? t('keywords.aes.placeholder')
                                    : t('keywords.xor.placeholder')
                        }
                        value={keyword}
                        onChange={(e) => handleKeywordChange(e)}
                        className="backdrop-blur-sm bg-opacity-20 border-opacity-20"
                        type={method === "xor" ? "password" : "text"}
                    />
                    <p className="text-xs text-muted-foreground">
                        {method === "vigenere"
                            ? t('encryptions.outputs.messages.vigenere')
                            : method === "aes"
                                ? t('encryptions.outputs.messages.aes', { count: keyLength })
                                : t('encryptions.outputs.messages.xor')}
                    </p>
                </div>
            )}

            <Button
                onClick={handleEncrypt}
                className="w-full"
                disabled={!plaintext.trim() || (method !== "rsa" && !keyword.trim())}
            >
                {t("buttons.encrypt")}
            </Button>

            {showResult && (
                <ResultCard
                    title={t("encryptions.outputs.label")}
                    text={ciphertext}
                    onClear={() => {
                        setShowResult(false)
                        setCiphertext("")
                    }}
                />
            )}
        </motion.div>
    )
}