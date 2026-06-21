import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

const HD_COLORS = { '生': '#4fc3f7', '旦': '#f06292', '净': '#ffb74d', '丑': '#81c784' }

export default function RadarChart({ data }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)
  const [selectedChar, setSelectedChar] = useState(null)

  useEffect(() => {
    if (!data?.characterCentrality?.top_by_metric) return
    const { characters, top_by_metric } = data.characterCentrality

    // Use top 8 PageRank characters
    const topCharsRaw = top_by_metric.top_pagerank?.slice(0, 8) || []
    if (topCharsRaw.length < 3) return

    // Normalize data format: entries are {name, values: {...}}
    const topChars = topCharsRaw.map(entry => ({
      name: entry.name,
      ...(entry.values || {}),
    }))

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    const indicators = [
      { name: '出场次数', max: 0 },
      { name: '平均度', max: 0 },
      { name: 'PageRank', max: 0 },
      { name: '中间中心性', max: 0 },
    ]

    const seriesData = []
    topChars.forEach((ch, i) => {
      const appears = ch.appearances || 1
      const deg = ch.avg_degree || 0
      const pr = ch.avg_pagerank || 0
      const bc = ch.avg_betweenness || 0

      indicators[0].max = Math.max(indicators[0].max, appears)
      indicators[1].max = Math.max(indicators[1].max, deg)
      indicators[2].max = Math.max(indicators[2].max, pr)
      indicators[3].max = Math.max(indicators[3].max, bc)

      seriesData.push({
        name: ch.name,
        value: [appears, deg, pr, bc],
        itemStyle: { color: Object.values(HD_COLORS)[i % 4] },
      })
    })

    const option = {
      tooltip: {},
      legend: {
        data: seriesData.map(d => d.name),
        textStyle: { color: '#8899aa', fontSize: 10 },
        orient: 'vertical',
        right: 0,
        top: 20,
      },
      radar: {
        center: ['45%', '55%'],
        radius: '65%',
        indicator: indicators,
        axisName: { color: '#8899aa', fontSize: 10 },
        splitArea: { areaStyle: { color: ['rgba(79,195,247,0.05)', 'transparent'] } },
      },
      series: [{
        type: 'radar',
        data: seriesData,
        emphasis: { lineStyle: { width: 3 } },
      }],
    }

    instanceRef.current.setOption(option, true)

    instanceRef.current.off('click')
    instanceRef.current.on('click', (params) => {
      if (params.name) setSelectedChar(params.name)
    })
  }, [data])

  useEffect(() => {
    const handleResize = () => instanceRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      {selectedChar && (
        <div style={{ position: 'absolute', bottom: 8, left: 8, fontSize: '0.75rem', color: '#8899aa' }}>
          选中: <strong style={{ color: '#4fc3f7' }}>{selectedChar}</strong>
        </div>
      )}
    </div>
  )
}
