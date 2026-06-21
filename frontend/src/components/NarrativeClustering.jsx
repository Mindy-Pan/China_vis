import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const TYPE_COLORS = {
  '历史戏': '#ff7043', '家庭戏': '#42a5f5', '公案戏': '#66bb6a', '神话戏': '#ab47bc', '其他': '#78909c',
}
const STRUCTURE_SHAPES = {
  'single_peak': 'circle', 'dual_peak': 'diamond', 'multi_peak': 'triangle',
}

export default function NarrativeClustering({ data }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.narrativeData?.features) return
    const features = data.narrativeData.features.filter(f => f.x !== undefined && f.y !== undefined)

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    const types = [...new Set(features.map(f => f.type).filter(Boolean))]

    const option = {
      tooltip: {
        formatter: (params) => {
          const vs = params.value
          return `<strong>${vs[2]} (${vs[3]})</strong><br/>结构: ${vs[4]}<br/>高潮位置: ${(vs[5] * 100).toFixed(0)}%`
        },
      },
      legend: { data: types, textStyle: { color: '#8899aa', fontSize: 10 }, top: 0 },
      grid: { left: 50, right: 20, top: 30, bottom: 40 },
      xAxis: { type: 'value', axisLabel: { show: false }, splitLine: { lineStyle: { color: '#1e2d3d' } } },
      yAxis: { type: 'value', axisLabel: { show: false }, splitLine: { lineStyle: { color: '#1e2d3d' } } },
      series: types.map(t => ({
        name: t,
        type: 'scatter',
        data: features.filter(f => f.type === t).map(f => ({
          value: [f.x, f.y, f.title, f.type, f.structure_type, f.climax_position],
          symbol: STRUCTURE_SHAPES[f.structure_type] || 'circle',
        })),
        symbolSize: 8,
        itemStyle: { color: TYPE_COLORS[t] || '#78909c', opacity: 0.7 },
        emphasis: { itemStyle: { opacity: 1, borderColor: '#fff', borderWidth: 1 } },
      })),
    }

    instanceRef.current.setOption(option, true)
  }, [data])

  useEffect(() => {
    const handleResize = () => instanceRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <div ref={chartRef} className="chart-container" />
}
