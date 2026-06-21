import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const HD_COLORS = { '生': '#4fc3f7', '旦': '#f06292', '净': '#ffb74d', '丑': '#81c784' }

export default function BubbleChart({ data }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!data?.matrixData?.matrix) return

    const { matrix, role_totals } = data.matrixData

    // Build bubble data: each role-hd pair as a bubble
    const bubbles = []
    for (const role in matrix) {
      for (const hd in matrix[role]) {
        bubbles.push({
          role,
          hd,
          value: matrix[role][hd],
          color: HD_COLORS[hd] || '#546e7a',
        })
      }
    }
    // Sort biggest first
    bubbles.sort((a, b) => b.value - a.value)

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

    // Pack layout
    const pack = d3.pack()
      .size([width * 0.9, height * 0.9])
      .padding(3)

    const root = d3.hierarchy({ children: bubbles })
      .sum(d => d.value)

    const nodes = pack(root).leaves()

    // Scale for bubble radius
    const maxR = d3.max(nodes, d => d.r)

    // Draw bubbles
    const nodeGroup = g.selectAll('g')
      .data(nodes)
      .join('g')
      .attr('transform', d => `translate(${d.x - width / 2},${d.y - height / 2})`)

    nodeGroup.append('circle')
      .attr('r', d => d.r)
      .attr('fill', d => d.data.color)
      .attr('opacity', 0.7)
      .attr('stroke', d => d.data.color)
      .attr('stroke-width', 1)
      .on('mouseover', function () {
        d3.select(this).attr('opacity', 1).attr('stroke', '#fff').attr('stroke-width', 2)
      })
      .on('mouseout', function () {
        d3.select(this).attr('opacity', 0.7).attr('stroke', d => d.data.color).attr('stroke-width', 1)
      })

    // Labels on larger bubbles
    nodeGroup.filter(d => d.r > 15)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.3em')
      .attr('fill', '#fff')
      .attr('font-size', d => Math.min(d.r / 3, 11))
      .text(d => d.data.role)

    nodeGroup.filter(d => d.r > 15)
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .attr('fill', 'rgba(255,255,255,0.7)')
      .attr('font-size', d => Math.min(d.r / 3.5, 10))
      .text(d => `${d.data.hd}·${d.data.value}`)

    // Tooltip handling
    nodeGroup.append('title')
      .text(d => `${d.data.role} × ${d.data.hd}\n角色数: ${d.data.value}`)

  }, [data])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
