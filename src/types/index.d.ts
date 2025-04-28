interface Message {
    type: string
    sender: string
    content: string
    decryptedContent: string | undefined
    timestamp: string
}