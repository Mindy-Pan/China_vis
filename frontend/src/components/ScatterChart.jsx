import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

const HD_COLORS = { '生': '#4fc3f7', '旦': '#f06292', '净': '#ffb74d', '丑': '#81c784' }

// Simple PCA-like projection from character features to 2D
function projectTo2D(chars) {
  const features = ['utterance_count', 'avg_text_len', 'command_score', 'battle_score', 'emotion_score', 'degree', 'utterance_fraction']

  // Normalize
  const normalized = chars.map(c => {
    const vec = features.map(f => Math.log10(c[f] + 1))
    return vec
  })

  // Compute covariance-like projection (simple weighted sum)
  const weights1 = [0.4, -0.1, 0.5, 0.3, -0.2, 0.4, 0.5]
  const weights2 = [-0.2, 0.5, 0.1, 0.4, 0.5, -0.1, 0.3]

  return chars.map((c, i) => {
    const v = normalized[i]
    const x = v.reduce((sum, val, j) => sum + val * weights1[j], 0)
    const y = v.reduce((sum, val, j) => sum + val * weights2[j], 0)
    return { ...c, x, y }
  })
}

export default function ScatterChart({ data, selectedHd }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)
  const [tooltipChar, setTooltipChar] = useState(null)

  useEffect(() => {
    if (!data?.characterData) return
    const chars = data.characterData.filter(c => c.hangdang_main)

    const projected = projectTo2D(chars)

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    const hds = ['生', '旦', '净', '丑']
    const series = hds.map(hd => {
      const pts = projected.filter(c => c.hangdang_main === hd)
      return {
        name: hd,
        type: 'scatter',
        data: pts.map(p => [p.x, p.y, p.character_name, p.title, p.role_type]),
        symbolSize: 5,
        itemStyle: { color: HD_COLORS[hd], opacity: 0.7 },
        emphasis: { itemStyle: { opacity: 1, borderColor: '#fff', borderWidth: 1 } },
      }
    })

    const option = {
      tooltip: {
        formatter: (params) => {
          const [, , name, title, role] = params.value
          return `<strong>${name}</strong> (${params.seriesName})<br/>剧本: ${title}<br/>角色类型: ${role}`
        },
      },
      legend: {
        data: hds,
        textStyle: { color: '#8899aa', fontSize: 11 },
        top: 0,
      },
      grid: { left: 50, right: 20, top: 30, bottom: 40 },
      xAxis: {
        type: 'value',
        name: '权力/行为轴 →',
        nameTextStyle: { color: '#8899aa', fontSize: 10 },
        axisLabel: { show: false },
        splitLine: { lineStyle: { color: '#1e2d3d' } },
      },
      yAxis: {
        type: 'value',
        name: '情感/语言轴 →',
        nameTextStyle: { color: '#8899aa', fontSize: 10 },
        axisLabel: { show: false },
        splitLine: { lineStyle: { color: '#1e2d3d' } },
      },
      series,
    }

    instanceRef.current.setOption(option, true)

    instanceRef.current.off('click')
    instanceRef.current.on('click', (params) => {
      if (params.value) {
        setTooltipChar({
          name: params.value[2],
          hangdang: params.seriesName,
          title: params.value[3],
          role: params.value[4],
        })
      }
    })
  }, [data])

  useEffect(() => {
    const handleResize = () => instanceRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div ref={chartRef} className="chart-container" />
      {tooltipChar && (
        <div className="tooltip-info">
          选中: <strong>{tooltipChar.name}</strong>
          <span className={`badge badge-${tooltipChar.hangdang === '生' ? 'sheng' : tooltipChar.hangdang === '旦' ? 'dan' : tooltipChar.hangdang === '净' ? 'jing' : 'chou'}`} style={{ marginLeft: 8 }}>{tooltipChar.hangdang}</span>
          <span style={{ marginLeft: 8, color: '#8899aa' }}>{tooltipChar.title} · {tooltipChar.role}</span>
        </div>
      )}
    </div>
  )
}
