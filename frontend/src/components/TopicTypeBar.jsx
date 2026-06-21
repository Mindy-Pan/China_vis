import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const THEME_COLORS = [
  '#ff7043','#42a5f5','#66bb6a','#ab47bc','#ffca28',
  '#ef5350','#26c6da','#8d6e63','#7986cb','#4db6ac',
  '#f48fb1','#a1887f','#90a4ae','#ce93d8','#81c784',
]

export default function TopicTypeBar({ data }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.themeTypeComp?.matrix) return
    const { types, themes, matrix } = data.themeTypeComp

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    const topThemes = themes.slice(0, 10)

    const option = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: types,
        textStyle: { color: '#8899aa', fontSize: 10 },
        top: 0,
      },
      grid: { left: 70, right: 20, top: 30, bottom: 40 },
      xAxis: {
        type: 'category',
        data: topThemes,
        axisLabel: { color: '#8899aa', fontSize: 10, rotate: 30 },
        axisLine: { lineStyle: { color: '#2a3a4a' } },
      },
      yAxis: {
        type: 'value',
        name: '主题强度 (%)',
        axisLabel: { color: '#8899aa', formatter: v => (v * 100).toFixed(0) + '%' },
        splitLine: { lineStyle: { color: '#1e2d3d' } },
      },
      series: types.map((t, i) => ({
        name: t,
        type: 'bar',
        barGap: '15%',
        itemStyle: { color: THEME_COLORS[i], borderRadius: [3, 3, 0, 0] },
        data: topThemes.map(th => (matrix[t]?.[th] || 0) * 100),
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
