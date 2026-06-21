import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

const COLORS = {
  '将军': '#e53935', '谋士': '#1565c0', '帝王': '#f9a825', '后妃': '#e91e63',
  '官员': '#7b1fa2', '士兵': '#6d4c41', '平民': '#43a047', '仆役': '#ff6f00',
  '神仙': '#00acc1', '侠客': '#c62828', '书生': '#2e7d32', '武将': '#b71c1c',
  '奸臣': '#455a64', '僧道': '#546e7a', '女将': '#c2185b', '其他': '#78909c',
  '生': '#4fc3f7', '旦': '#f06292', '净': '#ffb74d', '丑': '#81c784',
}

export default function SankeyChart({ data, onSelect }) {
  const chartRef = useRef(null)
  const instanceRef = useRef(null)

  useEffect(() => {
    if (!data?.sankeyData) return
    const { nodes, links } = data.sankeyData

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(chartRef.current, null, { renderer: 'canvas' })
    }

    const option = {
      tooltip: { trigger: 'item', triggerOn: 'mousemove' },
      series: [{
        type: 'sankey',
        layoutIterations: 32,
        emphasis: { focus: 'adjacency' },
        nodeAlign: 'left',
        layout: 'none',
        data: nodes.map(n => ({
          name: n.name,
          itemStyle: { color: COLORS[n.name] || '#546e7a' },
        })),
        links: links.map(l => ({
          source: nodes[l.source].name,
          target: nodes[l.target].name,
          value: l.value,
        })),
        label: { fontSize: 12, color: '#e0e6ed' },
        lineStyle: { color: 'gradient', curveness: 0.5, opacity: 0.3 },
      }],
    }

    instanceRef.current.setOption(option, true)

    instanceRef.current.on('click', (params) => {
      if (params.dataType === 'node' && onSelect) {
        onSelect(params.name)
      }
    })
  }, [data, onSelect])

  useEffect(() => {
    const handleResize = () => instanceRef.current?.resize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <div ref={chartRef} className="chart-container tall" />
}
