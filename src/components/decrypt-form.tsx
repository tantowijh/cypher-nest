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

export function DecryptForm() {
    const [ciphertext, setCiphertext] = useState("")
    const [keyword, setKeyword] = useState("")
    const [plaintext, setPlaintext] = useState("")
    const [showResult, setShowResult] = useState(false)
    const [method, setMethod] = useState<"vigenere" | "xor" | "aes" | "rsa">("vigenere") // Include AES and RSA
    const [keyLength, setKeyLength] = useState(0)
    const { t } = useTranslation()

    const handleDecrypt = async () => {
        try {
            if (!ciphertext.trim()) {
                toast.error(t('functionalities.decrypt.errors.ciphertext.empty'))
                return
            }

            if (method !== "rsa" && !keyword.trim()) {
                toast.error(t('functionalities.decrypt.errors.keyword.empty'))
                return
            }

            if (method === "aes" && keyword.length !== 16) {
                toast.error(t('functionalities.decrypt.errors.keyword.aes'))
                return
            }

            // Make a POST request to the backend API
            const response = await axios.post("/api/decrypt", {
                ciphertext,
                keyword: method === "rsa" ? undefined : keyword, // RSA doesn't need a keyword
                method,
            })

            // Extract the decrypted text from the response
            const { decrypted } = response.data
            setPlaintext(decrypted)
            setShowResult(true)
            toast.success(t('functionalities.decrypt.success'))
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.detail || t('functionalities.decrypt.errors.general'))
            } else {
                toast.error(t('functionalities.decrypt.errors.unknown'))
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
                <Label htmlFor="ciphertext">{t('inputs.ciphertext.label')}</Label>
                <Textarea
                    id="ciphertext"
                    placeholder={t('inputs.ciphertext.placeholder')}
                    value={ciphertext}
                    onChange={(e) => setCiphertext(e.target.value)}
                    className="min-h-[120px] backdrop-blur-sm bg-opacity-20 border-opacity-20"
                />
            </div>

            {method !== "rsa" && (
                <div className="space-y-2">
                    <Label htmlFor="decrypt-keyword">
                        {method === "vigenere" ? "Keyword" : method === "aes" ? "16-Character Key" : "Passphrase"}
                    </Label>
                    <Input
                        id="decrypt-keyword"
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
                            ? t('decryptions.outputs.messages.vigenere')
                            : method === "aes"
                                ? t('decryptions.outputs.messages.aes', { count: keyLength })
                                : t('decryptions.outputs.messages.xor')}
                    </p>
                </div>
            )}

            <Button
                onClick={handleDecrypt}
                className="w-full"
                disabled={!ciphertext.trim() || (method !== "rsa" && !keyword.trim())}
            >
                {t("buttons.decrypt")}
            </Button>

            {showResult && (
                <ResultCard
                    title={t("decryptions.outputs.label")}
                    text={plaintext}
                    onClear={() => {
                        setShowResult(false)
                        setPlaintext("")
                    }}
                />
            )}
        </motion.div>
    )
}