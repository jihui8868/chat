import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import './JsonViewer.css'

const TITLES = {
  db_status: '数据库运行状态',
}

function StatusCard({ label, value, highlight }) {
  return (
    <div className={`status-card ${highlight ? 'highlight' : ''}`}>
      <span className="status-card-label">{label}</span>
      <span className="status-card-value">{value}</span>
    </div>
  )
}

function CollapsibleSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="json-section">
      <button className="json-section-header" onClick={() => setOpen(!open)}>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span>{title}</span>
      </button>
      {open && <div className="json-section-body">{children}</div>}
    </div>
  )
}

function DbStatusViewer({ data }) {
  const processlist = data.processlist || []
  const longQueries = data.long_running_queries || []
  const status = data.status || {}
  const config = data.config || {}
  const bgwriter = data.bgwriter || {}
  const activityByState = data.activity_by_state || {}
  const dbStats = data.db_stats || {}

  return (
    <div className="db-status-viewer">
      {/* Summary cards */}
      <div className="status-cards">
        <StatusCard label="数据库类型" value={data.db_type === 'mysql' ? 'MySQL' : 'PostgreSQL'} />
        <StatusCard label="版本" value={data.version} />
        <StatusCard label="运行时间" value={data.uptime_human} />
        {data.innodb_buffer_hit_rate_pct != null && (
          <StatusCard
            label="InnoDB 缓冲命中率"
            value={`${data.innodb_buffer_hit_rate_pct}%`}
            highlight={data.innodb_buffer_hit_rate_pct < 90}
          />
        )}
        {data.cache_hit_rate_pct != null && (
          <StatusCard
            label="缓存命中率"
            value={`${data.cache_hit_rate_pct}%`}
            highlight={data.cache_hit_rate_pct < 90}
          />
        )}
        {data.waiting_locks != null && (
          <StatusCard
            label="等待锁数"
            value={data.waiting_locks}
            highlight={data.waiting_locks > 0}
          />
        )}
      </div>

      {/* MySQL status variables */}
      {Object.keys(status).length > 0 && (
        <CollapsibleSection title="运行状态变量" defaultOpen>
          <div className="kv-grid">
            {Object.entries(status).map(([k, v]) => (
              <div key={k} className="kv-row">
                <span className="kv-key">{k}</span>
                <span className="kv-value">{v}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* MySQL config variables */}
      {Object.keys(config).length > 0 && (
        <CollapsibleSection title="配置变量">
          <div className="kv-grid">
            {Object.entries(config).map(([k, v]) => (
              <div key={k} className="kv-row">
                <span className="kv-key">{k}</span>
                <span className="kv-value">{v}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* PostgreSQL activity by state */}
      {Object.keys(activityByState).length > 0 && (
        <CollapsibleSection title="连接状态分布" defaultOpen>
          <div className="kv-grid">
            {Object.entries(activityByState).map(([k, v]) => (
              <div key={k} className="kv-row">
                <span className="kv-key">{k || 'null'}</span>
                <span className="kv-value">{v}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* PostgreSQL db stats */}
      {Object.keys(dbStats).length > 0 && (
        <CollapsibleSection title="数据库统计">
          <div className="kv-grid">
            {Object.entries(dbStats).map(([k, v]) => (
              <div key={k} className="kv-row">
                <span className="kv-key">{k}</span>
                <span className="kv-value">{v}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* PostgreSQL bgwriter */}
      {Object.keys(bgwriter).length > 0 && (
        <CollapsibleSection title="后台写入统计">
          <div className="kv-grid">
            {Object.entries(bgwriter).map(([k, v]) => (
              <div key={k} className="kv-row">
                <span className="kv-key">{k}</span>
                <span className="kv-value">{v}</span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* MySQL processlist */}
      {processlist.length > 0 && (
        <CollapsibleSection title={`进程列表（${processlist.length} 个）`}>
          <div className="process-table-scroll">
            <table className="process-table">
              <thead>
                <tr>
                  <th>ID</th><th>用户</th><th>数据库</th>
                  <th>命令</th><th>时间(s)</th><th>状态</th><th>SQL</th>
                </tr>
              </thead>
              <tbody>
                {processlist.map((p, i) => (
                  <tr key={i}>
                    <td>{p.id}</td>
                    <td>{p.user}</td>
                    <td>{p.db || '—'}</td>
                    <td>{p.command}</td>
                    <td>{p.time}</td>
                    <td>{p.state || '—'}</td>
                    <td className="sql-cell">{p.info || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>
      )}

      {/* PostgreSQL long running queries */}
      {longQueries.length > 0 && (
        <CollapsibleSection title={`长时间运行的查询（${longQueries.length} 个）`} defaultOpen>
          <div className="process-table-scroll">
            <table className="process-table">
              <thead>
                <tr>
                  <th>PID</th><th>用户</th><th>状态</th><th>时长(s)</th><th>SQL</th>
                </tr>
              </thead>
              <tbody>
                {longQueries.map((q, i) => (
                  <tr key={i}>
                    <td>{q.pid}</td>
                    <td>{q.usename}</td>
                    <td>{q.state}</td>
                    <td>{q.duration_sec}</td>
                    <td className="sql-cell">{q.query}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>
      )}
    </div>
  )
}

export default function JsonViewer({ data_type, data }) {
  if (!data) return null

  const title = TITLES[data_type] || '详情'

  return (
    <div className="json-viewer-wrapper">
      <div className="json-viewer-title">{title}</div>
      {data_type === 'db_status' ? (
        <DbStatusViewer data={data} />
      ) : (
        <pre className="json-raw">{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  )
}
