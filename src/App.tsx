import { useState, useEffect } from 'react'
import type { LeaveInput } from './algorithms/types'
import { useHolidays } from './hooks/useHolidays'
import { useLeaveRecommendation } from './hooks/useLeaveRecommendation'
import { Sidebar } from './components/Sidebar'
import { ResultPanel } from './components/ResultPanel'
import { decodeState, pushState } from './lib/urlState'

export default function App() {
  const [input, setInput] = useState<Partial<LeaveInput>>(() => ({
    mode: 'even',
    season: 'summer',
    ...decodeState(),
  }))
  const [committed, setCommitted] = useState<LeaveInput | null>(null)

  const year = input.resetDate?.getFullYear() ?? new Date().getFullYear()
  const { data: holidays, loading, fromFallback } = useHolidays(year)
  const result = useLeaveRecommendation(committed, holidays)

  useEffect(() => { pushState(input) }, [input])

  function handleCalculate() {
    if (input.remainingDays && input.resetDate && input.mode) {
      setCommitted(input as LeaveInput)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fafafa]">
      <Sidebar
        value={input}
        onChange={setInput}
        onCalculate={handleCalculate}
      />
      <ResultPanel
        result={result}
        holidays={holidays}
        resetDate={input.resetDate ?? null}
        loading={loading}
        fromFallback={fromFallback}
      />
    </div>
  )
}
