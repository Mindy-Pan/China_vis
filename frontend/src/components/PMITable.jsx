import React from 'react'

const HD_LABELS = ['生', '旦', '净', '丑']
const HD_COLORS_BG = { '生': 'rgba(79,195,247,0.15)', '旦': 'rgba(240,98,146,0.15)', '净': 'rgba(255,183,77,0.15)', '丑': 'rgba(129,199,132,0.15)' }

export default function PMITable({ data }) {
  if (!data?.matrixData?.pmi) return null

  const { pmi, purity, entropy } = data.matrixData

  // Build ranked list of role-hd pairs by PMI
  const pairs = []
  for (const role in pmi) {
    for (const hd in pmi[role]) {
      pairs.push({ role, hd, pmi: pmi[role][hd] })
    }
  }
  pairs.sort((a, b) => b.pmi - a.pmi)

  // Get purity and entropy per hangdang
  const hdMetrics = HD_LABELS.map(hd => ({
    hd,
    purity: purity[hd]?.toFixed(3) || '-',
    entropy: entropy[hd]?.toFixed(3) || '-',
  }))

  return (
    <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
      {/* Purity & Entropy */}
      <div style={{ display: 'flex', gap: 16 }}>
        {hdMetrics.map(m => (
          <div key={m.hd} style={{
            flex: 1, padding: '8px 12px', borderRadius: 6,
            background: HD_COLORS_BG[m.hd], textAlign: 'center',
          }}>
            <div className={`badge badge-${m.hd === '生' ? 'sheng' : m.hd === '旦' ? 'dan' : m.hd === '净' ? 'jing' : 'chou'}`} style={{ marginBottom: 4 }}>{m.hd}</div>
            <div style={{ fontSize: '0.7rem', color: '#8899aa' }}>
              纯度: <strong style={{ color: '#e0e6ed' }}>{m.purity}</strong>
              &nbsp;|&nbsp;
              熵: <strong style={{ color: '#e0e6ed' }}>{m.entropy}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* PMI Table */}
      <table>
        <thead>
          <tr>
            <th>角色类型</th>
            <th>行当</th>
            <th>PMI 关联强度</th>
            <th>解读</th>
          </tr>
        </thead>
        <tbody>
          {pairs.slice(0, 15).map((p, i) => {
            const interpretation = p.pmi > 1.5 ? '极强绑定' :
                                   p.pmi > 0.8 ? '强绑定' :
                                   p.pmi > 0.3 ? '中等关联' :
                                   p.pmi > 0 ? '弱关联' : '负关联'
            return (
              <tr key={i}>
                <td>{p.role}</td>
                <td><span className={`badge badge-${p.hd === '生' ? 'sheng' : p.hd === '旦' ? 'dan' : p.hd === '净' ? 'jing' : 'chou'}`}>{p.hd}</span></td>
                <td style={{ fontWeight: 600, color: p.pmi > 0.5 ? '#81c784' : p.pmi > 0 ? '#ffb74d' : '#e57373' }}>
                  {p.pmi > 0 ? '+' : ''}{p.pmi.toFixed(3)}
                </td>
                <td style={{ color: '#8899aa', fontSize: '0.75rem' }}>{interpretation}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
