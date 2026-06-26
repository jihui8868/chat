import { useState } from 'react'
import { MapPinned } from 'lucide-react'
import './LoginPage.css'

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    setError('')
    setLoading(true)
    try {
      await onLogin(username.trim(), password)
    } catch (err) {
      setError(err.message || '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <MapPinned size={32} />
          <span>智能客服</span>
        </div>

        <h2 className="login-title">欢迎回来</h2>
        <p className="login-subtitle">请登录您的账号以继续</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-item">
            <label className="form-label">用户名</label>
            <input
              className="form-input"
              type="text"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="form-item">
            <label className="form-label">密码</label>
            <input
              className="form-input"
              type="password"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button
            className="login-btn"
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="login-hint">测试账号：admin / 123456</p>
      </div>
    </div>
  )
}
