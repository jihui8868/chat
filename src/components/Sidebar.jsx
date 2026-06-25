import { Button, Menu, Avatar, Dropdown } from 'antd'
import { PencilSparkles, Plus, MapPinned, PanelLeftOpen, PanelRightOpen, Settings, Menu as MenuIcon } from 'lucide-react'
import './Sidebar.css'

export default function Sidebar({
  collapsed,
  onToggleCollapsed,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewChat
}) {
  const menuItems = conversations.map(conv => ({
    key: conv.id.toString(),
    label: (
      <div className="conversation-item">
        <span className="title">{conv.title}</span>
      </div>
    ),
  }))

  const userMenuItems = [
    {
      key: 'settings',
      label: '设置',
      icon: <Settings size={16} />
    },
    {
      key: 'profile',
      label: '个人资料'
    }
  ]

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* 顶部 - 标题 + 折叠按钮 */}
      <div className="sidebar-header">
        <h2 className="sidebar-title"><MapPinned size={24} />智能客服</h2>
        <button className="collapse-btn" onClick={onToggleCollapsed} title="切换侧边栏">
          <PanelRightOpen size={20} />
        </button>
      </div>

      {/* 新对话按钮 */}
      <Button
        type="primary"
        block
        className="new-chat-btn"
        onClick={onNewChat}
        icon={<PencilSparkles size={18} />}
      >
        发起新会话
      </Button>

      {/* 历史对话列表 */}
      <div className="conversations-container">
        <Menu
          mode="vertical"
          selectedKeys={[currentConversationId.toString()]}
          onSelect={(e) => onSelectConversation(parseInt(e.key))}
          items={menuItems}
          className="conversations-menu"
        />
      </div>

      {/* 底部 - 用户信息 + 设置 */}
      <div className="sidebar-footer">
        <div className="user-info">
          <Avatar size={40} style={{ backgroundColor: '#1677ff' }}>
            JH
          </Avatar>
          <div className="user-details">
            <span className="user-name">冀辉</span>
          </div>
        </div>

        <Dropdown menu={{ items: userMenuItems }} placement="topRight">
          <button className="settings-btn" title="更多选项">
            <Settings size={20} />
          </button>
        </Dropdown>
      </div>
    </div>
  )
}
