import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const TYPE_COLORS = {
  '历史戏': '#ff7043', '家庭戏': '#42a5f5', '公案戏': '#66bb6a', '神话戏': '#ab47bc',
}

export default function StructureComparison({ data }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.narrativeTypeAgg) return
    const agg = data.narrativeTypeAgg
    const types = Object.keys(agg)

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    // Structure type distribution
    const structureTypes = ['single_peak', 'dual_peak', 'multi_peak']
    const structureLabels = ['单峰结构', '双峰结构', '多峰结构']

    const option = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: structureLabels,
        textStyle: { color: '#8899aa', fontSize: 10 },
        top: 0,
      },
      grid: { left: 70, right: 20, top: 30, bottom: 40 },
      xAxis: {
        type: 'category',
        data: types,
        axisLabel: { color: '#8899aa', fontSize: 11 },
        axisLine: { lineStyle: { color: '#2a3a4a' } },
      },
      yAxis: {
        type: 'value',
        name: '占比 (%)',
        max: 100,
        axisLabel: { color: '#8899aa' },
        splitLine: { lineStyle: { color: '#1e2d3d' } },
      },
      series: structureTypes.map((st, i) => ({
        name: structureLabels[i],
        type: 'bar',
        stack: 'total',
        color: i === 0 ? '#42a5f5' : i === 1 ? '#ffb74d' : '#ef5350',
        emphasis: { focus: 'series' },
        data: types.map(t => agg[t]?.structure_type_pct?.[st] || 0),
        label: {
          show: true,
          fontSize: 10,
          color: '#e0e6ed',
          formatter: p => p.value > 10 ? `${p.value}%` : '',
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
