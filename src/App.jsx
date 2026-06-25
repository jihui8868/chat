import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [conversations, setConversations] = useState([
    { id: 1, title: '如何学习React?', timestamp: '今天 14:30' },
    { id: 2, title: '前端性能优化', timestamp: '昨天 10:15' },
    { id: 3, title: 'CSS Grid 布局', timestamp: '3天前' },
  ])
  const [currentConversationId, setCurrentConversationId] = useState(1)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'user',
      content: '你好，请帮我解释一下 React Hooks 的工作原理？',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      type: 'system',
      content: 'React Hooks 是在函数式组件中使用状态和其他 React 特性的方式。\n\n**主要 Hooks 包括：**\n\n1. **useState** - 用于在函数组件中添加状态\n2. **useEffect** - 用于处理副作用（数据获取、订阅等）\n3. **useContext** - 用于访问 React Context\n4. **useReducer** - 用于复杂的状态管理\n5. **useRef** - 用于访问 DOM 节点或保存可变值\n\n**工作原理：**\n\nHooks 通过闭包和调用顺序来跟踪组件的状态。每次组件渲染时，Hooks 按相同顺序被调用，这使 React 能够正确地关联状态值与具体的 Hook。',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      type: 'user',
      content: '那 useEffect 的依赖数组有什么作用呢？',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: 4,
      type: 'system',
      content: '依赖数组控制 useEffect 何时运行：\n\n- **空数组 `[]`** - 仅在组件挂载时运行一次\n- **不传依赖数组** - 每次组件渲染后都运行\n- **包含依赖项** - 当依赖项变化时运行\n\n```javascript\nuseEffect(() => {\n  // 仅在挂载时运行\n  console.log(\'Component mounted\')\n}, [])\n\nuseEffect(() => {\n  // 当 userId 或 postId 变化时运行\n  fetchData(userId, postId)\n}, [userId, postId])\n```\n\n不正确设置依赖数组会导致性能问题或 bug。',
      timestamp: new Date(Date.now() - 120000)
    }
  ])

  const handleNewChat = () => {
    const newId = Math.max(...conversations.map(c => c.id)) + 1
    const newConversation = {
      id: newId,
      title: '新对话',
      timestamp: '现在'
    }
    setConversations([newConversation, ...conversations])
    setCurrentConversationId(newId)
    setMessages([])
  }

  const handleSelectConversation = (id) => {
    setCurrentConversationId(id)
    // 这里可以根据选择的对话ID加载对应的消息
  }

  const handleSendMessage = (content) => {
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: content,
      timestamp: new Date()
    }
    setMessages([...messages, userMessage])

    // 模拟系统回复
    setTimeout(() => {
      const systemMessage = {
        id: messages.length + 2,
        type: 'system',
        content: '这是一个模拟的系统回复。实际应用中，这里会调用后端 API 获取真实的回复内容。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, systemMessage])
    }, 1000)
  }

  return (
    <div className="app-container">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
      />
      <MainContent
        messages={messages}
        onSendMessage={handleSendMessage}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
    </div>
  )
}

export default App
