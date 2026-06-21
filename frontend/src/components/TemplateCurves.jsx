import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const TYPE_COLORS = {
  '历史戏': '#ff7043', '家庭戏': '#42a5f5', '公案戏': '#66bb6a', '神话戏': '#ab47bc',
}

export default function TemplateCurves({ data }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.narrativeTemplates) return
    const templates = data.narrativeTemplates
    const types = Object.keys(templates)

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    const xLabels = ['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10','S11','S12']

    const option = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: types,
        textStyle: { color: '#8899aa', fontSize: 10 },
        top: 0,
      },
      grid: { left: 55, right: 20, top: 30, bottom: 40 },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLabel: { color: '#8899aa', fontSize: 9 },
        name: '叙事进度 →',
        nameTextStyle: { color: '#546e7a', fontSize: 10 },
      },
      yAxis: {
        type: 'value',
        name: '平均张力',
        axisLabel: { color: '#8899aa' },
        splitLine: { lineStyle: { color: '#1e2d3d' } },
      },
      series: types.map(t => ({
        name: t,
        type: 'line',
        smooth: true,
        data: templates[t].avg_curve,
        lineStyle: { color: TYPE_COLORS[t] || '#78909c', width: 2.5 },
        itemStyle: { color: TYPE_COLORS[t] },
        symbol: 'circle',
        symbolSize: 4,
        areaStyle: { opacity: 0.05 },
        markLine: {
          silent: true,
          data: [{ type: 'max', label: { formatter: '高潮', color: '#8899aa', fontSize: 10 } }],
        },
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
