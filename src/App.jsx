import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import LoginPage from './components/LoginPage'
import {
  login, saveAuth, loadAuth, clearAuth,
  fetchConversations, createConversation, updateConversation,
  fetchMessages, streamChat,
} from './api/index.js'

function App() {
  const [auth, setAuth] = useState(() => loadAuth())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [conversations, setConversations] = useState([])
  const [convsLoading, setConvsLoading] = useState(false)

  const [currentConvId, setCurrentConvId] = useState(null)
  const [messages, setMessages] = useState([])
  const [msgsLoading, setMsgsLoading] = useState(false)

  // 加载当前用户的会话列表
  const loadConversations = useCallback(async (userId) => {
    setConvsLoading(true)
    try {
      const items = await fetchConversations(userId)
      setConversations(items)
      // 默认选中最新的一条
      if (items.length > 0) {
        setCurrentConvId(items[0].id)
      }
    } catch (e) {
      console.error('加载会话失败', e)
    } finally {
      setConvsLoading(false)
    }
  }, [])

  // 登录或恢复 session 后加载会话
  useEffect(() => {
    if (auth?.user?.id) loadConversations(auth.user.id)
    else { setConversations([]); setCurrentConvId(null); setMessages([]) }
  }, [auth, loadConversations])

  // 切换会话时加载消息
  useEffect(() => {
    if (!currentConvId) { setMessages([]); return }
    let cancelled = false
    setMsgsLoading(true)
    setMessages([])
    fetchMessages(currentConvId)
      .then(items => {
        if (cancelled) return
        setMessages(items.map(m => ({ ...m, timestamp: new Date(m.created_at) })))
      })
      .catch(e => console.error('加载消息失败', e))
      .finally(() => { if (!cancelled) setMsgsLoading(false) })
    return () => { cancelled = true }
  }, [currentConvId])

  const handleLogin = async (username, password) => {
    const { token, user } = await login(username, password)
    saveAuth(token, user)
    setAuth({ token, user })
  }

  const handleLogout = () => {
    clearAuth()
    setAuth(null)
  }

  const handleNewChat = async () => {
    try {
      const conv = await createConversation(auth.user.id, '新对话')
      setConversations(prev => [conv, ...prev])
      setCurrentConvId(conv.id)
      setMessages([])
    } catch (e) {
      console.error('创建会话失败', e)
    }
  }

  const handleSelectConversation = (id) => {
    if (id !== currentConvId) setCurrentConvId(id)
  }

  const handleSendMessage = async (content) => {
    // 确保有会话（无会话时先创建）
    let convId = currentConvId
    if (!convId) {
      const conv = await createConversation(auth.user.id, content.slice(0, 30))
      setConversations(prev => [conv, ...prev])
      setCurrentConvId(conv.id)
      convId = conv.id
    }

    // 更新会话标题
    const conv = conversations.find(c => c.id === convId)
    if (conv?.title === '新对话') {
      updateConversation(convId, { title: content.slice(0, 30) }).then(updated => {
        setConversations(prev => prev.map(c => c.id === convId ? updated : c))
      }).catch(() => {})
    }

    // 乐观显示用户消息 + 空的 AI 气泡（流式占位）
    const tempUserId = `temp-user-${Date.now()}`
    const tempAiId = `temp-ai-${Date.now()}`
    const now = new Date()
    setMessages(prev => [
      ...prev,
      { id: tempUserId, conversation_id: convId, type: 'user', content, timestamp: now, created_at: now.toISOString() },
      { id: tempAiId, conversation_id: convId, type: 'assistant', content: '', timestamp: now, created_at: now.toISOString(), streaming: true },
    ])

    try {
      await streamChat(convId, content, {
        onUserMessage: (msg) => {
          setMessages(prev => prev.map(m =>
            m.id === tempUserId ? { ...msg, timestamp: new Date(msg.created_at) } : m
          ))
        },
        onChunk: (chunk) => {
          setMessages(prev => prev.map(m =>
            m.id === tempAiId ? { ...m, content: m.content + chunk } : m
          ))
        },
        onDone: (msg) => {
          setMessages(prev => prev.map(m =>
            m.id === tempAiId ? { ...msg, timestamp: new Date(msg.created_at) } : m
          ))
          setConversations(prev => {
            const idx = prev.findIndex(c => c.id === convId)
            if (idx < 0) return prev
            const updated = { ...prev[idx], updated_at: new Date().toISOString() }
            return [updated, ...prev.filter(c => c.id !== convId)]
          })
        },
        onError: (detail) => {
          console.error('流式响应错误:', detail)
          setMessages(prev => prev.filter(m => m.id !== tempAiId))
        },
      })
    } catch (e) {
      console.error('发送消息失败', e)
      setMessages(prev => prev.filter(m => m.id !== tempUserId && m.id !== tempAiId))
    }
  }

  if (!auth) return <LoginPage onLogin={handleLogin} />

  return (
    <div className="app-container">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        conversations={conversations}
        convsLoading={convsLoading}
        currentConvId={currentConvId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        user={auth.user}
        onLogout={handleLogout}
      />
      <MainContent
        messages={messages}
        msgsLoading={msgsLoading}
        onSendMessage={handleSendMessage}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
    </div>
  )
}

export default App
