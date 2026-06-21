import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

const TYPE_COLORS = {
  '历史戏': '#ff7043', '家庭戏': '#42a5f5', '公案戏': '#66bb6a',
  '神话戏': '#ab47bc',
}

const COM_COLORS = d3.schemeSet3

export default function ForceGraph({ data, selectedType }) {
  const svgRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    if (!data?.networkReps) return

    // Get the representative for selected type
    let rep
    if (selectedType && data.networkReps[selectedType]) {
      rep = data.networkReps[selectedType]
    } else {
      // Default: first available
      const types = Object.keys(data.networkReps)
      if (types.length === 0) return
      rep = data.networkReps[types[0]]
    }

    const { nodes, edges } = rep.graph
    if (!nodes || nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const g = svg.append('g')

    // Add zoom
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform))
    svg.call(zoom)

    // Build community color map from representative data
    const communityMap = {}
    if (rep.communities) {
      rep.communities.forEach((c, i) => {
        c.members.forEach(m => { communityMap[m] = COM_COLORS[i % COM_COLORS.length] })
      })
    }

    // Scale node size by degree
    const maxDeg = d3.max(nodes, d => d.degree) || 1
    const sizeScale = d3.scaleSqrt().domain([0, maxDeg]).range([5, 30])

    // Build link data
    const links = edges.map(e => ({ ...e }))
    const nodeMap = {}
    const simNodes = nodes.map(n => {
      nodeMap[n.id] = n
      return { ...n }
    })

    // Simulation
    const simulation = d3.forceSimulation(simNodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => sizeScale(d.degree) + 5))

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => {
        const w = d.weight || 1
        const alpha = Math.min(0.6, 0.1 + w * 0.1)
        return `rgba(255,255,255,${alpha})`
      })
      .attr('stroke-width', d => Math.min(4, Math.sqrt(d.weight || 1) * 1.2))

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(simNodes)
      .join('g')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x; d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x; d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null; d.fy = null
        })
      )

    node.append('circle')
      .attr('r', d => sizeScale(d.degree))
      .attr('fill', d => communityMap[d.id] || TYPE_COLORS[selectedType] || '#546e7a')
      .attr('opacity', 0.8)
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mouseover', (event, d) => {
        d3.select(event.target).attr('opacity', 1).attr('stroke-width', 2)
        setTooltip({ name: d.id, degree: d.degree })
      })
      .on('mouseout', (event) => {
        d3.select(event.target).attr('opacity', 0.8).attr('stroke-width', 1)
        setTooltip(null)
      })

    node.append('text')
      .text(d => d.id.length > 4 ? d.id.slice(0, 4) + '..' : d.id)
      .attr('dy', d => sizeScale(d.degree) + 12)
      .attr('text-anchor', 'middle')
      .attr('fill', '#8899aa')
      .attr('font-size', d => Math.min(11, Math.max(7, sizeScale(d.degree) * 0.6)))

    // Title
    node.append('title').text(d => `${d.id}\n度: ${d.degree}`)

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y)
      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })

    return () => simulation.stop()
  }, [data, selectedType])

  const types = data?.networkReps ? Object.keys(data.networkReps) : []

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ marginBottom: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {types.map(t => (
          <button key={t} onClick={() => {/* handled by parent */}}
            style={{
              padding: '4px 12px', borderRadius: 4, border: '1px solid #2a3a4a',
              background: selectedType === t ? TYPE_COLORS[t] : 'transparent',
              color: selectedType === t ? '#fff' : '#8899aa',
              cursor: 'pointer', fontSize: '0.75rem',
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <svg ref={svgRef} style={{ width: '100%', height: 'calc(100% - 40px)' }} />
      {tooltip && (
        <div style={{
          position: 'absolute', top: 40, right: 8,
          padding: '6px 10px', background: '#1a2634', border: '1px solid #2a3a4a',
          borderRadius: 4, fontSize: '0.75rem', color: '#e0e6ed',
        }}>
          <strong>{tooltip.name}</strong> · 度: {tooltip.degree}
        </div>
      )}
    </div>
  )
}
