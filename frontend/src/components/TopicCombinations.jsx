import React from 'react'

export default function TopicCombinations({ data }) {
  if (!data?.themeCooc?.association_rules) return null

  const { association_rules, top_pairs } = data.themeCooc

  return (
    <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
      {/* Association Rules */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', borderRadius: 6,
        border: '1px solid #2a3a4a', padding: 12,
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e0e6ed', marginBottom: 8 }}>
          主题关联规则 (Association Rules)
        </div>
        <div style={{ fontSize: '0.7rem', color: '#546e7a', marginBottom: 10 }}>
          {`{前件} → {后件}  Lift > 1.5 表示显著关联`}
        </div>
        <table>
          <thead>
            <tr>
              <th>前件 (Antecedent)</th>
              <th>后件 (Consequent)</th>
              <th>置信度</th>
              <th>提升度</th>
              <th>支持度</th>
            </tr>
          </thead>
          <tbody>
            {association_rules.slice(0, 15).map((rule, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{rule.antecedent}</td>
                <td>{rule.consequent}</td>
                <td>{(rule.confidence * 100).toFixed(1)}%</td>
                <td style={{
                  color: rule.lift > 3 ? '#81c784' : rule.lift > 2 ? '#ffb74d' : '#8899aa',
                  fontWeight: 600,
                }}>
                  {rule.lift.toFixed(2)}×
                </td>
                <td>{(rule.support * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top PMI pairs */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', borderRadius: 6,
        border: '1px solid #2a3a4a', padding: 12,
      }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#e0e6ed', marginBottom: 8 }}>
          PMI 主题关联强度 TOP15
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {top_pairs.slice(0, 15).map((p, i) => (
            <span key={i} style={{
              padding: '4px 10px', borderRadius: 12,
              background: p.pmi > 0.08 ? 'rgba(129,199,132,0.15)' :
                         p.pmi > 0.04 ? 'rgba(255,183,77,0.1)' : 'rgba(255,255,255,0.04)',
              color: p.pmi > 0.08 ? '#81c784' : p.pmi > 0.04 ? '#ffb74d' : '#8899aa',
              fontSize: '0.72rem',
            }}>
              {p.theme1} ↔ {p.theme2}
              <span style={{ marginLeft: 4, fontWeight: 600 }}>
                {p.pmi.toFixed(3)}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
