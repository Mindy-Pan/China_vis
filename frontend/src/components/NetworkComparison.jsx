import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const TYPE_COLORS = {
  '历史戏': '#ff7043', '家庭戏': '#42a5f5', '公案戏': '#66bb6a', '神话戏': '#ab47bc',
}

const LABEL_MAP = {
  avg_density: '网络密度', avg_clustering: '聚集系数',
  avg_path_length: '平均路径长度', avg_modularity: '模块度',
  avg_community_count: '社区数量', avg_centralization: '中心化程度',
  avg_nodes: '平均角色数',
}

export default function NetworkComparison({ data }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.networkComparison?.metrics) return
    const { types, metrics } = data.networkComparison

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    const metricKeys = Object.keys(metrics).filter(k => {
      const vals = Object.values(metrics[k].values)
      return vals.length > 0 && vals.some(v => v > 0)
    })

    const option = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: types,
        textStyle: { color: '#8899aa', fontSize: 11 },
        top: 0,
      },
      grid: { left: 80, right: 20, top: 30, bottom: 40 },
      xAxis: {
        type: 'category',
        data: metricKeys.map(k => metrics[k].label),
        axisLabel: { color: '#8899aa', fontSize: 10 },
        axisLine: { lineStyle: { color: '#2a3a4a' } },
      },
      yAxis: {
        type: 'value',
        name: '指标值',
        axisLabel: { color: '#8899aa' },
        splitLine: { lineStyle: { color: '#1e2d3d' } },
      },
      series: types.map(t => ({
        name: t,
        type: 'bar',
        barGap: '15%',
        itemStyle: { color: TYPE_COLORS[t], borderRadius: [3, 3, 0, 0] },
        emphasis: { focus: 'series' },
        data: metricKeys.map(k => metrics[k].values[t] || 0),
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
