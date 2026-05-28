import { useState, useEffect } from 'react'
import { getHolidays } from '../lib/holidays'
import type { HolidayMap } from '../algorithms/types'

interface State {
  data: HolidayMap
  loading: boolean
  fromFallback: boolean
}

export function useHolidays(year: number): State {
  const [state, setState] = useState<State>({ data: {}, loading: true, fromFallback: false })

  useEffect(() => {
    setState(s => ({ ...s, loading: true }))
    getHolidays(year).then(({ data, fromFallback }) => {
      setState({ data, loading: false, fromFallback })
    })
  }, [year])

  return state
}
