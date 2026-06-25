import './EmptyState.css'

export default function EmptyState() {
  const suggestions = [
    '如何学习 React？',
    'CSS Grid vs Flexbox',
    '前端性能优化',
    '异步编程最佳实践',
    'TypeScript 入门指南',
    '数据库设计原理'
  ]

  return (
    <div className="empty-state">
      <div className="empty-content">
        <h2 className="empty-title">今天想做点什么？</h2>
        <div className="suggestions-grid">
          {suggestions.map((suggestion, index) => (
            <button key={index} className="suggestion-card">
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
