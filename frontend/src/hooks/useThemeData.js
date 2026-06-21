import { useState, useEffect } from 'react'

const DATA_FILES = {
  themeSummary: '/data/theme_summary.json',
  themeScriptDist: '/data/theme_script_distributions.json',
  themeCooc: '/data/theme_cooccurrence.json',
  themeSpace: '/data/theme_topic_space.json',
  themeTypeComp: '/data/theme_type_comparison.json',
  themeEvolution: '/data/theme_evolution.json',
  themeSankey: '/data/theme_sankey.json',
  themeLLM: '/data/theme_llm_labels.json',
}

export function useThemeData() {
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
