import { useState } from 'react'

export function useFilter(data) {
  const [selectedHangdang, setSelectedHangdang] = useState('all')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedVolume, setSelectedVolume] = useState('all')

  const hangdangs = data?.summary?.hangdang_main_distribution
    ? Object.keys(data.summary.hangdang_main_distribution).filter(h => h)
    : []

  const roles = data?.matrixData?.role_totals
    ? Object.keys(data.matrixData.role_totals)
    : []

  const volumes = data?.eraData?.time_series
    ? data.eraData.time_series.map(d => d.era)
    : []

  return {
    selectedHangdang, setSelectedHangdang,
    selectedRole, setSelectedRole,
    selectedVolume, setSelectedVolume,
    hangdangs,
    roles,
    volumes,
  }
}
