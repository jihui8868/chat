import { useState } from 'react'
import TopBar from './TopBar'
import ChatArea from './ChatArea'
import InputArea from './InputArea'
import './MainContent.css'

export default function MainContent({ messages, msgsLoading, onSendMessage, sidebarCollapsed, onToggleSidebar }) {
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async (content) => {
    setIsSending(true)
    try {
      await onSendMessage(content)
    } finally {
      // AI 回复约 1 秒后到，多留 1.2 秒给动画
      setTimeout(() => setIsSending(false), 1200)
    }
  }

  const isLoading = msgsLoading || isSending

  return (
    <div className="main-content">
      <TopBar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={onToggleSidebar} />
      <ChatArea messages={messages} isLoading={isLoading} />
      <InputArea onSendMessage={handleSendMessage} disabled={isSending} />
    </div>
  )
}
