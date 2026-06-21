import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const HD_COLORS = { '生': '#4fc3f7', '旦': '#f06292', '净': '#ffb74d', '丑': '#81c784' }

export default function StackedBarChart({ data }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.eraData?.time_series) return
    const ts = data.eraData.time_series

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    const hdKeys = ['生', '旦', '净', '丑']

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          let html = `<strong>${params[0].name}</strong><br/>`
          params.forEach(p => {
            if (p.value > 0) {
              html += `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color};margin-right:6px"></span>`
              html += `${p.seriesName}: ${(p.value * 100).toFixed(1)}%<br/>`
            }
          })
          return html
        },
      },
      legend: {
        data: hdKeys,
        textStyle: { color: '#8899aa', fontSize: 11 },
        top: 0,
      },
      grid: { left: 60, right: 20, top: 30, bottom: 60 },
      xAxis: {
        type: 'category',
        data: ts.map(d => d.era),
        axisLabel: { color: '#8899aa', fontSize: 10, rotate: 30 },
        axisLine: { lineStyle: { color: '#2a3a4a' } },
      },
      yAxis: {
        type: 'value',
        name: '占比',
        axisLabel: { color: '#8899aa', formatter: v => `${(v * 100).toFixed(0)}%` },
        splitLine: { lineStyle: { color: '#1e2d3d' } },
        max: 1,
      },
      series: hdKeys.map(hd => ({
        name: hd,
        type: 'bar',
        stack: 'total',
        color: HD_COLORS[hd],
        emphasis: { focus: 'series' },
        data: ts.map(d => d[hd] || 0),
      })),
    }

    instanceRef.current.setOption(option, true)
  }, [data])

  useEffect(() => {
    const handleResize = () => instanceRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <div ref={chartRef} className="chart-container tall" />
}
