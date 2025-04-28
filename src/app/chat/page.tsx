"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send } from "lucide-react"
import axios from "axios"
import { Switch } from "@/components/ui/switch"
import NavigationBar from "@/components/navigation-bar"
import { pusherClient } from "@/lib/pusher"

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [username, setUsername] = useState("")
    const [isConnected, setIsConnected] = useState(true)
    const [secretKey, setSecretKey] = useState("")
    const [usernameSubmitted, setUsernameSubmitted] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [showEncrypted, setShowEncrypted] = useState(false)

    // Load secret key from api endpoint
    const fetchSecretKey = async () => {
        try {
            const response = await axios.get("/api/chat/load-key")
            setSecretKey(response.data)
        } catch (error) {
            console.error("Error fetching secret key:", error)
        }
    }

    const generateKey = async () => {
        try {
            await axios.get("/api/chat/generate-key")
        } catch (error) {
            console.error("Error generating key:", error)
        }
        // Fetch the new secret key
        fetchSecretKey()
    }

    const handleEncrypt = async (message: string) => {
        // Encrypt the message using the api endpoint
        try {
            console.log("Encrypting message:", message)
            const response = await axios.post("/api/chat/encrypt", {
                message,
            })
            console.log("Encrypted message:", response.data)
            return response.data
        } catch (error) {
            console.error("Error encrypting message:", error)
            return message
        }
    }

    const handleDecrypt = async (encryptedMessage: string) => {
        // Decrypt the message using the api endpoint
        try {
            console.log("Decrypting message:", encryptedMessage)
            const response = await axios.post("/api/chat/decrypt", {
                encryptedMessage,
            })
            console.log("Decrypted message:", response.data)
            return response.data
        } catch (error) {
            console.error("Error decrypting message:", error)
            return encryptedMessage
        }
    }

    const handleUserJoin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await axios.post("/api/chat/user-joined", { username })
            setUsernameSubmitted(true)
        } catch (error) {
            console.error("Error notifying user joined:", error);
        }
    };

    useEffect(() => {
        const channel = pusherClient.subscribe("cypher-chat");

        // Handle successful subscription
        channel.bind("pusher:subscription_succeeded", () => {
            setIsConnected(true);
        });

        // Handle subscription error
        channel.bind("pusher:subscription_error", async () => {
            setIsConnected(false);
        });

        // Listen for notifications
        channel.bind("notification", (notification: Message) => {
            setMessages((prev) => [...prev, notification]);
        })

        const messageQueue: Message[] = [];
        let isProcessingQueue = false;

        const processMessageQueue = async () => {
            if (isProcessingQueue) return;
            isProcessingQueue = true;

            while (messageQueue.length > 0) {
                const message = messageQueue.shift();
                if (message) {
                    await fetchSecretKey();
                    const decryptedMessage = await handleDecrypt(message.content);
                    setMessages((prev) => [
                        ...prev,
                        {
                            ...message,
                            decryptedContent: decryptedMessage,
                        },
                    ]);
                }
            }

            isProcessingQueue = false;
        };

        channel.bind("upcomming-message", (message: Message) => {
            messageQueue.push(message);
            processMessageQueue();
        });

        return () => {
            // Unsubscribe from the channel when the component unmounts
            pusherClient.unsubscribe("cypher-chat")
        }
    }, [])

    useEffect(() => {
        const handleUserLeft = async () => {
            if (username) {
                try {
                    await axios.post("/api/chat/user-left", { username });
                } catch (error) {
                    console.error("Error notifying user left:", error);
                }
            }
        };

        // Trigger userLeft when the page is about to unload
        const handleBeforeUnload = () => {
            handleUserLeft();
        };

        // Add event listeners for page unload
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Cleanup event listeners on component unmount
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [username]);

    useEffect(() => {
        // Scroll to bottom when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()

        if (input.trim() && isConnected) {
            // Encrypt the message before sending
            const content = await handleEncrypt(input.trim())
            const message = {
                type: "message",
                sender: username,
                content: content,
                decryptedContent: undefined,
                timestamp: new Date().toISOString(),
            }

            // Send the message to the server
            await axios.post("/api/chat/send", message)
            setInput("")
        }
    }

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    if (!usernameSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/50">
                <NavigationBar />
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-center">Enter Your Username</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUserJoin} className="space-y-4">
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full"
                            />
                            <Button type="submit" className="w-full" variant="primary">
                                Join Chat
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/50 sm:p-4">
            <NavigationBar />
            <Card className="w-full max-w-2xl mt-20 sm:mt-0 h-[calc(100vh-5rem)] sm:h-[80vh] flex flex-col rounded-none sm:rounded-lg">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CardTitle>Cypher Chat</CardTitle>
                        </div>
                        <Badge variant={isConnected ? "success" : "destructive"}>
                            {isConnected ? "Connected" : "Disconnected"}
                        </Badge>
                    </div>
                    <hr className="my-2" />
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full flex gap-2 flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <div className="font-xs text-sm">Show Encrypted Messages</div>
                                <div className="text-xs text-muted-foreground">
                                    Choose whether to show the encrypted messages in the chat.
                                </div>
                            </div>
                            <div>
                                <Switch
                                    checked={showEncrypted}
                                    onCheckedChange={setShowEncrypted}
                                />
                            </div>
                        </div>
                        <div className="w-full flex gap-2 flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <div className="font-xs text-sm">Secret Key</div>
                                <div
                                    className="text-xs text-muted-foreground break-all" // Added break-all for long text wrapping
                                    style={{ wordBreak: "break-word", overflowWrap: "break-word" }} // Inline styles for additional safety
                                >
                                    {secretKey}
                                </div>
                            </div>
                            <div>
                                <Button size="sm" variant="primary" onClick={generateKey}>
                                    Generate Key
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index}>
                                {
                                    message.type === "notification" ? (
                                        <>
                                            <div className="flex justify-center">
                                                <div className="text-sm text-muted-foreground">
                                                    {message.content}
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className={`flex ${message.sender === username ? "justify-end" : "justify-start"}`}>
                                            <div className="flex items-start gap-2 max-w-[80%]">
                                                {message.sender !== username && (
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{message.sender.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                                <div className={`flex flex-col ${message.sender === username ? "items-end" : "items-start"}`}>
                                                    <div className="flex items-center gap-2">
                                                        {message.sender !== username && <span className="text-sm font-medium">{message.sender}</span>}
                                                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                                                    </div>
                                                    <div
                                                        className={`rounded-lg p-3 
                                                ${message.sender === username
                                                                ? "bg-blue-700/80 text-primary-foreground dark:bg-blue-400/80"
                                                                : "bg-muted"}
                                            `}
                                                        style={{
                                                            wordBreak: "break-word", // Break long words
                                                            overflowWrap: "break-word", // Wrap long words
                                                            maxWidth: "100%", // Prevent the bubble from overflowing
                                                        }}
                                                    >
                                                        <div>
                                                            {showEncrypted && (
                                                                <>
                                                                    <span className="text-xs">
                                                                        {message.content}
                                                                    </span>
                                                                    <hr className="my-2" />
                                                                </>
                                                            )}
                                                            {message.decryptedContent}
                                                        </div>
                                                    </div>
                                                </div>
                                                {message.sender === username && (
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>{message.sender.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </CardContent>
                <CardFooter className="border-t p-4 flex flex-col">
                    <form onSubmit={handleSendMessage} className="flex w-full gap-2 mt-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1"
                            disabled={!isConnected}
                        />
                        <Button variant="primary" type="submit" size="icon" disabled={!isConnected}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </div >
    )
}
