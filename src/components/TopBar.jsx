import { Dropdown, Button } from 'antd'
import { MoreVertical, PanelLeftOpen, Database, Settings, Users, Building, Menu as MenuIcon } from 'lucide-react'
import './TopBar.css'

export default function TopBar({ sidebarCollapsed, onToggleSidebar }) {
  const menuItems = [
    {
      key: 'datasource',
      label: '数据源管理',
      icon: <Database size={16} />
    },
    {
      key: 'system',
      label: '系统管理',
      icon: <Settings size={16} />
    },
    {
      key: 'users',
      label: '用户管理',
      icon: <Users size={16} />
    },
    {
      key: 'organization',
      label: '组织管理',
      icon: <Building size={16} />
    }
  ]

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        {sidebarCollapsed && (
          <button className="topbar-toggle-btn" onClick={onToggleSidebar} title="展开侧边栏">
            <PanelLeftOpen size={20} />
          </button>
        )}
        <h1 className="conversation-title"></h1>
      </div>

      <div className="top-bar-right">
        <Dropdown menu={{ items: menuItems }} placement="bottomRight">
          <Button type="text" icon={<MoreVertical size={20} />} />
        </Dropdown>
      </div>
    </div>
  )
}
