import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export default function CommunityGraph({ data, selectedType }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.networkReps) return

    const rep = selectedType && data.networkReps[selectedType]
      ? data.networkReps[selectedType]
      : Object.values(data.networkReps)[0]

    if (!rep?.communities || rep.communities.length === 0) return

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    // Build treemap/sunburst for communities
    const commData = rep.communities.map((c, i) => ({
      name: `社群${i + 1}`,
      value: c.size,
      children: c.members.slice(0, 10).map(m => ({ name: m, value: 1 })),
    }))

    const option = {
      tooltip: {
        formatter: (params) => {
          return `<strong>${params.name}</strong><br/>成员数: ${params.value}`
        },
      },
      series: [
        {
          type: 'sunburst',
          data: commData,
          radius: [0, '90%'],
          label: {
            rotate: 'radial',
            color: '#e0e6ed',
            fontSize: 10,
          },
          itemStyle: { borderWidth: 1, borderColor: '#0f1923' },
          levels: [
            {},
            { label: { fontSize: 12 }, itemStyle: { borderWidth: 2 } },
            { label: { fontSize: 9, position: 'outside' } },
          ],
        },
        {
          type: 'treemap',
          data: commData,
          radius: [0, '90%'],
          label: {
            show: true,
            formatter: '{b}',
            color: '#e0e6ed',
            fontSize: 10,
          },
          itemStyle: { borderWidth: 1, borderColor: '#0f1923' },
          visible: false,
        },
      ],
      legend: {
        data: commData.map(c => c.name),
        textStyle: { color: '#8899aa', fontSize: 10 },
        bottom: 0,
        selectedMode: 'single',
      },
    }

    instanceRef.current.setOption(option, true)
  }, [data, selectedType])

  useEffect(() => {
    const handleResize = () => instanceRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <div ref={chartRef} className="chart-container" />
}
