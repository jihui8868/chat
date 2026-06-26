import { useState } from 'react'
import { Button, Space } from 'antd'
import { ThumbsUp, ThumbsDown, Copy, Share2, RotateCcw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import './ChatMessage.css'

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.type === 'user'
  const displayType = isUser ? 'user' : 'system'

  return (
    <div className={`message-wrapper ${displayType}`}>
      <div className={`message-content ${displayType}`}>
        {isUser ? (
          <div className="user-message-bubble">
            {message.content}
          </div>
        ) : (
          <div className="system-message">
            <div className="markdown-content">
              <ReactMarkdown>
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {!isUser && (
          <div className="message-actions">
            <Button
              type="text"
              size="small"
              icon={<ThumbsUp size={16} />}
              title="点赞"
            />
            <Button
              type="text"
              size="small"
              icon={<ThumbsDown size={16} />}
              title="踩"
            />
            <Button
              type="text"
              size="small"
              icon={<Copy size={16} />}
              onClick={handleCopy}
              title={copied ? '已复制' : '复制'}
            />
            <Button
              type="text"
              size="small"
              icon={<Share2 size={16} />}
              title="分享"
            />
            <Button
              type="text"
              size="small"
              icon={<RotateCcw size={16} />}
              title="重新生成"
            />
          </div>
        )}
      </div>

      <span className="message-timestamp">
        {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    </div>
  )
}
