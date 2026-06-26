import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import EmptyState from './EmptyState'
import './ChatArea.css'

export default function ChatArea({ messages, isLoading }) {
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="chat-area empty">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="chat-area" ref={scrollContainerRef}>
      <div className="messages-container">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} streaming={message.streaming} />
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
