import { useEffect, useRef, useState } from "react"

function SupportChatPage() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const socketRef = useRef(null)

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080/ws/support")
        socketRef.current = socket

        socket.onmessage = (event) => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "assistant",
                    text: event.data
                }
            ])
        }

        socket.onerror = () => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "system",
                    text: "No se pudo conectar con el chat de soporte."
                }
            ])
        }

        return () => {
            socket.close()
        }
    }, [])

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current) {
            return
        }

        const message = input.trim()

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: message
            }
        ])

        socketRef.current.send(message)
        setInput("")
    }

    return (
        <div className="support-chat-page">
            <h1>Atención al cliente</h1>

            <div style={{ border: "1px solid #ccc", padding: "1rem", minHeight: "300px" }}>
                {messages.map((message, index) => (
                    <p key={index}>
                        <strong>
                            {message.sender === "user"
                                ? "Tú"
                                : message.sender === "assistant"
                                    ? "Asistente"
                                    : "Sistema"}
                            :
                        </strong>{" "}
                        {message.text}
                    </p>
                ))}
            </div>

            <div style={{ marginTop: "1rem" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            sendMessage()
                        }
                    }}
                    placeholder="Escribe tu consulta..."
                />

                <button onClick={sendMessage}>
                    Enviar
                </button>
            </div>
        </div>
    )
}

export default SupportChatPage