"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, PenToolIcon as Tool, Loader, AlertTriangle } from "lucide-react"
import { EventSourcePolyfill } from "event-source-polyfill"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ type: "ai", text: "Hello! I'm your AI assistant. Ask me anything about your schedule or any schedule exists here 😊." }])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)
  const userMail=(JSON.parse(localStorage.getItem('user'))).email;
  // Use a ref to track the current conversation state
  const conversationRef = useRef({
    botMessage: "",
    hasToolMessage: false,
    toolMessages: [],
  })

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    const userMessage = input.trim()
    if (!userMessage) return

    // Reset conversation state
    conversationRef.current = {
      botMessage: "",
      hasToolMessage: false,
      toolMessages: [],
    }

    setMessages((prev) => [...prev, { type: "user", text: userMessage }])
    setInput("")

    // Add a temporary "thinking" status message
    setMessages((prev) => [...prev, { type: "status", text: "thinking..." }])
    const message="***this is the user email if needed: ("+userMail+") ***\n\n"+userMessage
    const eventSource = new EventSourcePolyfill(`http://127.0.0.1:5000/chat?message=${encodeURIComponent(message)}`)

    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data)
      console.log(data)

      setMessages((prev) => {
        // Create a new array to avoid mutation issues
        let updated = [...prev]

        // Handle different message types
        if (data.type === "status") {
          // Replace the thinking status with the new status
          const statusIndex = updated.findIndex((msg) => msg.type === "status")
          if (statusIndex !== -1) {
            updated[statusIndex] = { type: "status", text: data.content }
          } else {
            updated.push({ type: "status", text: data.content })
          }
        } else if (data.type === "error") {
          // Remove any status message
          updated = updated.filter((msg) => msg.type !== "status")
          // Add error message
          updated.push({ type: "error", text: data.content || "An error occurred" })
          eventSource.close()
        } else if (data.type === "tool_start") {
          // Store the tool message in our ref
          conversationRef.current.hasToolMessage = true
          conversationRef.current.toolMessages.push({
            type: "tool",
            text: data.content,
            toolName: data.tool_name,
          })

          // Remove any status message
          updated = updated.filter((msg) => msg.type !== "status")

          // Add all tool messages
          updated = [...updated, ...conversationRef.current.toolMessages]
        } else if (data.type === "token") {
          // Update the bot message in our ref
          conversationRef.current.botMessage += data.content

          // Remove any status message and existing AI typing message
          updated = updated.filter((msg) => msg.type !== "status" && !(msg.type === "ai" && msg.isTyping))

          // Make sure all tool messages are included
          if (conversationRef.current.hasToolMessage) {
            // First remove any existing tool messages to avoid duplicates
            updated = updated.filter((msg) => msg.type !== "tool")
            // Then add all tool messages
            updated = [...updated, ...conversationRef.current.toolMessages]
          }

          // Add the AI typing message
          updated.push({
            type: "ai",
            text: conversationRef.current.botMessage,
            isTyping: true,
          })
        } else if (["final"].includes(data.type)) {
          // Remove any status message and existing AI typing message
          updated = updated.filter((msg) => msg.type !== "status" && !(msg.type === "ai" && msg.isTyping))

          // Make sure all tool messages are included
          if (conversationRef.current.hasToolMessage) {
            // First remove any existing tool messages to avoid duplicates
            updated = updated.filter((msg) => msg.type !== "tool")
            // Then add all tool messages
            updated = [...updated, ...conversationRef.current.toolMessages]
          }

          // Add the final AI message
          updated.push({
            type: "ai",
            text: conversationRef.current.botMessage,
          })

          eventSource.close()
        }

        return updated
      })
    }
  }

  // Render different message types
  const renderMessage = (msg, idx) => {
    if (msg.type === "status") {
      return (
        <div key={idx} className="flex justify-center my-2 animate-pulse">
          <div className="bg-gray-200 text-gray-600 rounded-full px-4 py-1 flex items-center">
            <Loader size={14} className="animate-spin mr-2" />
            <span>{msg.text}</span>
          </div>
        </div>
      )
    }

    if (msg.type === "tool") {
      return (
        <div key={idx} className="flex justify-center my-2">
          <div className="bg-amber-100 text-amber-800 border border-amber-200 rounded-xl px-3 py-2 flex items-center shadow-sm">
            <Tool size={14} className="mr-2 flex-shrink-0" />
            <span>
              <strong>{msg.toolName}</strong> - {msg.text}
            </span>
          </div>
        </div>
      )
    }

    if (msg.type === "error") {
      return (
        <div key={idx} className="flex justify-center my-2">
          <div className="bg-red-100 text-red-800 border border-red-200 rounded-xl px-3 py-2 flex items-center shadow-sm">
            <AlertTriangle size={14} className="mr-2 flex-shrink-0" />
            <span>{msg.text}</span>
          </div>
        </div>
      )
    }

    return (
      <div
        key={idx}
        className={`${
          msg.type === "ai" ? "text-gray-600 bg-white" : "text-white bg-indigo-500 ml-auto"
        } rounded-xl px-3 py-2 shadow-sm w-fit max-w-[85%] ${msg.isTyping ? "ai-typing" : ""}`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {msg.text}
        </ReactMarkdown>
        {msg.isTyping && <span className="typing-cursor">|</span>}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 h-[28rem] bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-sm tracking-wide">WassiBot 🤖</h2>
            <button onClick={() => setOpen(false)} className="hover:text-gray-200 transition" aria-label="Close chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 px-4 py-3 overflow-y-auto text-sm space-y-2 bg-gray-50">
            {messages.map((msg, idx) => renderMessage(msg, idx))}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer / Input */}
          <div className="bg-gray-100 px-3 py-2 relative">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend()
              }}
              className="w-full px-3 py-2 pr-12 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Chat message"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-full shadow-md hover:scale-110 hover:shadow-lg transition-all mr-2"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full p-4 shadow-xl hover:scale-105 transition-transform"
          aria-label="Open chat"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default AIChat
