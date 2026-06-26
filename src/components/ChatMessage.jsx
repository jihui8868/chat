import { useState } from 'react'
import { Button } from 'antd'
import { ThumbsUp, ThumbsDown, Copy, Share2, RotateCcw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import DataTable from './DataTable'
import JsonViewer from './JsonViewer'
import './ChatMessage.css'

function MessageBlock({ block }) {
  if (block.type === 'text') {
    return (
      <div className="markdown-content">
        <ReactMarkdown>{block.content}</ReactMarkdown>
      </div>
    )
  }
  if (block.type === 'table') {
    return <DataTable data_type={block.data_type} data={block.data} />
  }
  if (block.type === 'json') {
    return <JsonViewer data_type={block.data_type} data={block.data} />
  }
  return null
}

export default function ChatMessage({ message, streaming }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isUser = message.type === 'user'
  const displayType = isUser ? 'user' : 'system'
  const hasBlocks = message.blocks && message.blocks.length > 0

  return (
    <div className={`message-wrapper ${displayType}`}>
      <div className={`message-content ${displayType}`}>
        {isUser ? (
          <div className="user-message-bubble">
            {message.content}
          </div>
        ) : (
          <div className="system-message">
            {hasBlocks ? (
              <div className="blocks-container">
                {message.blocks.map((block, i) => (
                  <MessageBlock key={i} block={block} />
                ))}
                {streaming && <span className="streaming-cursor" />}
              </div>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown>{message.content}</ReactMarkdown>
                {streaming && <span className="streaming-cursor" />}
              </div>
            )}
          </div>
        )}

        {!isUser && (
          <div className="message-actions">
            <Button type="text" size="small" icon={<ThumbsUp size={16} />} title="点赞" />
            <Button type="text" size="small" icon={<ThumbsDown size={16} />} title="踩" />
            <Button
              type="text"
              size="small"
              icon={<Copy size={16} />}
              onClick={handleCopy}
              title={copied ? '已复制' : '复制'}
            />
            <Button type="text" size="small" icon={<Share2 size={16} />} title="分享" />
            <Button type="text" size="small" icon={<RotateCcw size={16} />} title="重新生成" />
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
