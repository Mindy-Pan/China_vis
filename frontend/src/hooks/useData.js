import { useState, useEffect } from 'react'

const DATA_FILES = {
  summary: '/data/summary.json',
  characterData: '/data/character_data.json',
  matrixData: '/data/matrix_data.json',
  eraData: '/data/era_data.json',
  sankeyData: '/data/sankey_data.json',
  overall: '/data/overall.json',
}

export function useData() {
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
