import React from 'react'

const METRIC_LABELS = {
  top_degree: { name: 'Degree 中心性', desc: '连接数最多的角色 → 谁是社交枢纽' },
  top_pagerank: { name: 'PageRank', desc: '影响力最大的角色 → 谁是权力中心' },
  top_betweenness: { name: 'Betweenness 中间性', desc: '桥梁角色 → 谁控制信息流动' },
}

export default function CentralityTable({ data }) {
  if (!data?.characterCentrality?.top_by_metric) return null

  const { top_by_metric } = data.characterCentrality

  return (
    <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
      {Object.entries(METRIC_LABELS).map(([key, { name, desc }]) => {
        const entries = top_by_metric[key] || []
        return (
          <div key={key} style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: 6,
            border: '1px solid #2a3a4a', padding: 12,
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e0e6ed', marginBottom: 2 }}>
              {name}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#546e7a', marginBottom: 8 }}>{desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {entries.slice(0, 10).map((entry, i) => {
                const ename = entry.name || Object.keys(entry)[0]
                const evals = entry.values || entry
                return (
                  <span key={i} style={{
                    padding: '3px 10px', borderRadius: 12,
                    background: i < 3 ? 'rgba(79,195,247,0.15)' : 'rgba(255,255,255,0.04)',
                    color: i < 3 ? '#4fc3f7' : '#8899aa',
                    fontSize: '0.75rem', fontWeight: i < 3 ? 600 : 400,
                    whiteSpace: 'nowrap',
                  }}>
                    {i + 1}. {ename}
                  </span>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
