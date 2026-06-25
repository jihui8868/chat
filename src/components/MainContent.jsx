import { useState } from 'react'
import TopBar from './TopBar'
import ChatArea from './ChatArea'
import InputArea from './InputArea'
import './MainContent.css'

export default function MainContent({ messages, onSendMessage, sidebarCollapsed, onToggleSidebar }) {
  const [isLoadingResponse, setIsLoadingResponse] = useState(false)

  const handleSendMessage = (content) => {
    setIsLoadingResponse(true)
    onSendMessage(content)

    setTimeout(() => {
      setIsLoadingResponse(false)
    }, 2000)
  }

  return (
    <div className="main-content">
      <TopBar sidebarCollapsed={sidebarCollapsed} onToggleSidebar={onToggleSidebar} />
      <ChatArea messages={messages} isLoading={isLoadingResponse} />
      <InputArea onSendMessage={handleSendMessage} disabled={isLoadingResponse} />
    </div>
  )
}
