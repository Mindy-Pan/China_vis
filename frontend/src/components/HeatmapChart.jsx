import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export default function HeatmapChart({ data }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.matrixData?.matrix) return
    const { matrix } = data.matrixData

    const roles = Object.keys(matrix).sort()
    const hds = ['生', '旦', '净', '丑']

    // Build heatmap data
    const heatData = []
    let maxVal = 0
    roles.forEach((role, ri) => {
      hds.forEach((hd, ci) => {
        const v = matrix[role][hd] || 0
        heatData.push([ci, ri, v])
        if (v > maxVal) maxVal = v
      })
    })

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    const option = {
      tooltip: {
        formatter: (params) => {
          const role = roles[params.value[1]]
          const hd = hds[params.value[0]]
          return `<strong>${role}</strong> × <strong>${hd}</strong><br/>角色数: ${params.value[2]}`
        },
      },
      grid: { left: 80, right: 60, top: 10, bottom: 30 },
      xAxis: {
        type: 'category',
        data: hds,
        axisLabel: { color: '#8899aa', fontSize: 12 },
        axisLine: { lineStyle: { color: '#2a3a4a' } },
        splitArea: { show: true, areaStyle: { color: ['rgba(255,255,255,0.02)', 'transparent'] } },
      },
      yAxis: {
        type: 'category',
        data: roles,
        axisLabel: { color: '#8899aa', fontSize: 11 },
        axisLine: { lineStyle: { color: '#2a3a4a' } },
      },
      visualMap: {
        min: 0,
        max: maxVal,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle: { color: '#8899aa' },
        inRange: { color: ['#0d1b2a', '#1565c0', '#29b6f6', '#4fc3f7', '#e1f5fe'] },
      },
      series: [{
        type: 'heatmap',
        data: heatData,
        label: {
          show: true,
          color: '#e0e6ed',
          fontSize: 10,
          formatter: p => p.value[2] > 0 ? p.value[2] : '',
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
        },
      }],
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
