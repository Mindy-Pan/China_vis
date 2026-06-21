import { useState, useEffect } from 'react'

const DATA_FILES = {
  networkSummary: '/data/network_summary.json',
  networkComparison: '/data/network_comparison.json',
  networkReps: '/data/network_representatives.json',
  characterCentrality: '/data/character_centrality.json',
  networksAll: '/data/networks_all.json',
  networkTypeAgg: '/data/network_type_aggregates.json',
}

export function useNetworkData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadAll() {
      try {
        const results = {}
        for (const [key, url] of Object.entries(DATA_FILES)) {
          const res = await fetch(url)
          if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`)
          results[key] = await res.json()
        }
        setData(results)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    loadAll()
  }, [])

  return { data, loading, error }
}
