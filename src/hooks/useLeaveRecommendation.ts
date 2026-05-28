import { useMemo } from 'react'
import { evenDistribution } from '../algorithms/evenDistribution'
import { holidayAppend } from '../algorithms/holidayAppend'
import { goldenHoliday } from '../algorithms/goldenHoliday'
import { minLeaveMaxRest } from '../algorithms/minLeaveMaxRest'
import { quarterlyBalance } from '../algorithms/quarterlyBalance'
import { seasonFocus } from '../algorithms/seasonFocus'
import type { LeaveInput, HolidayMap, LeaveRecommendation } from '../algorithms/types'

export function useLeaveRecommendation(input: LeaveInput | null, holidays: HolidayMap): LeaveRecommendation | null {
  return useMemo(() => {
    if (!input || input.remainingDays <= 0) return null
    const startDate = new Date()
    const args = { ...input, startDate, holidays }

    switch (input.mode) {
      case 'even': return evenDistribution(args)
      case 'append': return holidayAppend(args)
      case 'golden': return goldenHoliday(args)
      case 'minmax': return minLeaveMaxRest(args)
      case 'quarterly': return quarterlyBalance(args)
      case 'season': return seasonFocus({ ...args, season: input.season ?? 'summer' })
    }
  }, [input, holidays])
}
