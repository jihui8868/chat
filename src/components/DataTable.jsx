import './DataTable.css'

const COLUMN_CONFIGS = {
  database_list: [
    { key: 'name', label: '数据库名称' },
  ],
  table_list: [
    { key: 'name', label: '表名' },
    { key: 'engine', label: '引擎' },
    { key: 'rows', label: '行数（估算）' },
    { key: 'total_size', label: '大小' },
    { key: 'comment', label: '备注' },
  ],
  column_list: [
    { key: 'name', label: '字段名' },
    { key: 'type', label: '类型' },
    { key: 'nullable', label: '可空', render: (v) => (v ? '是' : '否') },
    { key: 'key', label: '键' },
    { key: 'default', label: '默认值' },
    { key: 'comment', label: '备注' },
  ],
}

function getTitle(data_type, data) {
  if (data_type === 'database_list') return `数据库列表（${(data.databases || []).length} 个）`
  if (data_type === 'table_list') return `${data.database || ''} 表列表（${(data.tables || []).length} 张）`
  if (data_type === 'column_list') return `${data.database || ''}.${data.table || ''} 字段信息（${(data.columns || []).length} 个字段）`
  return '查询结果'
}

function getRows(data_type, data) {
  if (data_type === 'database_list') return (data.databases || []).map((name) => ({ name }))
  if (data_type === 'table_list') return data.tables || []
  if (data_type === 'column_list') return data.columns || []
  return []
}

export default function DataTable({ data_type, data }) {
  if (!data) return null

  const config = COLUMN_CONFIGS[data_type]
  const rows = getRows(data_type, data)
  const title = getTitle(data_type, data)

  if (data.error) {
    return (
      <div className="data-table-wrapper">
        <div className="data-table-title">{title}</div>
        <div className="data-table-error">错误：{data.error}</div>
      </div>
    )
  }

  if (!config || rows.length === 0) {
    return (
      <div className="data-table-wrapper">
        <div className="data-table-title">{title}</div>
        <div className="data-table-empty">无数据</div>
      </div>
    )
  }

  return (
    <div className="data-table-wrapper">
      <div className="data-table-title">{title}</div>
      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {config.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {config.map((col) => {
                  const val = row[col.key]
                  const display = col.render ? col.render(val) : (val ?? '—')
                  return <td key={col.key}>{String(display)}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
