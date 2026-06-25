import { useState, useRef, useEffect } from 'react'
import { Button } from 'antd'
import { MapPinPlus, Mic, Send } from 'lucide-react'
import './InputArea.css'

export default function InputArea({ onSendMessage, disabled }) {
  const [input, setInput] = useState('')
  const textareaRef = useRef(null)

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [input])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !disabled) {
        handleSend()
      }
    }
  }

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input)
      setInput('')
    }
  }

  return (
    <div className="input-area">
      <div className="input-wrapper">
        <div className="input-content">
          {/* 左侧附件按钮 */}
          <button
            className="input-action-btn attachment-btn"
            disabled={disabled}
            title="添加附件"
          >
            <MapPinPlus size={20} />
          </button>

          {/* 中间输入框 */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题..."
            className="input-textarea"
            disabled={disabled}
            rows={1}
          />

          {/* 右侧操作按钮 */}
          <div className="input-actions">
            <button
              className="input-action-btn mic-btn"
              disabled={disabled}
              title="语音输入"
            >
              <Mic size={20} />
            </button>

            <button
              className={`input-action-btn send-btn ${input.trim() ? 'active' : ''}`}
              onClick={handleSend}
              disabled={!input.trim() || disabled}
              title="发送"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 免责声明 */}
      <p className="disclaimer">
        本 AI 可能会生成不准确的信息。请验证重要信息。
      </p>
    </div>
  )
}
