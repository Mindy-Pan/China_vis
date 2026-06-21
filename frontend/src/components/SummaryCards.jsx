import React from 'react'

const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 8px',
}

const valueStyle = { fontSize: '1.6rem', fontWeight: 700, color: '#4fc3f7' }
const labelStyle = { fontSize: '0.75rem', color: '#8899aa', marginTop: 4 }

export default function SummaryCards({ data }) {
  if (!data?.summary) return null
  const s = data.summary

  const mainHds = s.hangdang_main_distribution || {}
  const totalLabeled = Object.values(mainHds).reduce((a, b) => a + b, 0)

  return (
    <div className="card span-12" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <div style={cardStyle}>
        <div style={valueStyle}>{s.unique_scripts}</div>
        <div style={labelStyle}>剧本总数</div>
      </div>
      <div style={cardStyle}>
        <div style={valueStyle}>{s.total_characters}</div>
        <div style={labelStyle}>角色实例总数</div>
      </div>
      <div style={cardStyle}>
        <div style={valueStyle}>{totalLabeled}</div>
        <div style={labelStyle}>已标注行当</div>
      </div>
      <div style={cardStyle}>
        <div style={valueStyle}>{s.missing_hangdang_count}</div>
        <div style={labelStyle}>未标注角色 (待推断)</div>
      </div>
      {['生', '旦', '净', '丑'].map(hd => (
        <div key={hd} style={cardStyle}>
          <div style={{ ...valueStyle, fontSize: '1.2rem' }}>{mainHds[hd] || 0}</div>
          <div style={labelStyle}>
            <span className={`badge badge-${hd === '生' ? 'sheng' : hd === '旦' ? 'dan' : hd === '净' ? 'jing' : 'chou'}`}>{hd}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
