import { useState, useEffect, useRef } from 'react'
import { Button, Menu, Avatar, Spin } from 'antd'
import { PencilSparkles, MapPinned, PanelRightOpen, Settings, LogOut, MessageSquare } from 'lucide-react'
import './Sidebar.css'

function getInitials(name = '') {
  return name.slice(0, 2).toUpperCase() || '?'
}

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return '刚刚'
  if (min < 60) return `${min}分钟前`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}小时前`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}天前`
  return new Date(iso).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  conversations,
  convsLoading,
  currentConvId,
  onSelectConversation,
  onNewChat,
  user,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPos, setMenuPos] = useState({ bottom: 0, left: 0 })
  const btnRef = useRef(null)

  const openMenu = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect()
      setMenuPos({ bottom: window.innerHeight - rect.top + 8, left: rect.right - 140 })
    }
    setMenuOpen(true)
  }

  useEffect(() => {
    if (!menuOpen) return
    const close = (e) => {
      if (btnRef.current && !btnRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  const menuItems = conversations.map(conv => ({
    key: conv.id,
    label: (
      <div className="conversation-item">
        <span className="conv-title">{conv.title}</span>
        <span className="conv-time">{relativeTime(conv.updated_at)}</span>
      </div>
    ),
  }))

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title"><MapPinned size={24} />智能客服</h2>
        <button className="collapse-btn" onClick={onToggleCollapsed} title="切换侧边栏">
          <PanelRightOpen size={20} />
        </button>
      </div>

      <Button
        type="primary"
        block
        className="new-chat-btn"
        onClick={onNewChat}
        icon={<PencilSparkles size={18} />}
      >
        发起新会话
      </Button>

      <div className="conversations-container">
        {convsLoading ? (
          <div className="convs-loading"><Spin size="small" /></div>
        ) : conversations.length === 0 ? (
          <div className="convs-empty">
            <MessageSquare size={32} strokeWidth={1.2} />
            <span>暂无会话记录</span>
          </div>
        ) : (
          <Menu
            mode="vertical"
            selectedKeys={currentConvId ? [currentConvId] : []}
            onSelect={(e) => onSelectConversation(e.key)}
            items={menuItems}
            className="conversations-menu"
          />
        )}
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <Avatar size={40} style={{ backgroundColor: '#1677ff', flexShrink: 0 }}>
            {getInitials(user?.name)}
          </Avatar>
          <div className="user-details">
            <span className="user-name">{user?.name || user?.username || '未知用户'}</span>
            {user?.email && <span className="user-email">{user.email}</span>}
          </div>
        </div>

        <button ref={btnRef} className="settings-btn" title="更多选项" onClick={openMenu}>
          <Settings size={20} />
        </button>
      </div>

      {menuOpen && (
        <div
          className="user-popup-menu"
          style={{ bottom: menuPos.bottom, left: menuPos.left }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button className="user-popup-item" onClick={() => setMenuOpen(false)}>
            <Settings size={15} /><span>设置</span>
          </button>
          <div className="user-popup-divider" />
          <button className="user-popup-item danger" onClick={() => { setMenuOpen(false); onLogout() }}>
            <LogOut size={15} /><span>退出登录</span>
          </button>
        </div>
      )}
    </div>
  )
}
