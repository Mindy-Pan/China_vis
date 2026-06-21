import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const HD_COLORS = { '生': '#4fc3f7', '旦': '#f06292', '净': '#ffb74d', '丑': '#81c784' }

export default function PurityEntropyChart({ data }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.matrixData?.purity) return
    const { purity, entropy } = data.matrixData

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    const hds = ['生', '旦', '净', '丑']

    const option = {
      tooltip: { trigger: 'axis' },
      legend: {
        data: ['纯度 Purity', '分散度 Entropy'],
        textStyle: { color: '#8899aa', fontSize: 11 },
        top: 0,
      },
      grid: { left: 50, right: 50, top: 30, bottom: 30 },
      xAxis: {
        type: 'category',
        data: hds,
        axisLabel: { color: '#8899aa', fontSize: 12 },
        axisLine: { lineStyle: { color: '#2a3a4a' } },
      },
      yAxis: [
        {
          type: 'value',
          name: '纯度',
          min: 0,
          max: 1,
          axisLabel: { color: '#8899aa' },
          splitLine: { lineStyle: { color: '#1e2d3d' } },
        },
        {
          type: 'value',
          name: '熵',
          axisLabel: { color: '#8899aa' },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: '纯度 Purity',
          type: 'bar',
          data: hds.map(hd => ({
            value: purity[hd] || 0,
            itemStyle: { color: HD_COLORS[hd], opacity: 0.7 },
          })),
          barWidth: 40,
        },
        {
          name: '分散度 Entropy',
          type: 'line',
          yAxisIndex: 1,
          data: hds.map(hd => entropy[hd] || 0),
          lineStyle: { color: '#ff8a65', width: 2 },
          symbol: 'diamond',
          symbolSize: 10,
          itemStyle: { color: '#ff8a65' },
        },
      ],
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
