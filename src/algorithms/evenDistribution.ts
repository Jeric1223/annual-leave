import { getWorkdaysBetween, toDateStr, buildPeriodLabel, addDays, eachDayInRange, isRestDay } from './utils'
import type { HolidayMap, LeaveRecommendation, LeavePeriod } from './types'

interface Input {
  remainingDays: number
  resetDate: Date
  startDate: Date
  holidays: HolidayMap
}

export function evenDistribution({ remainingDays, resetDate, startDate, holidays }: Input): LeaveRecommendation {
  const workdays = getWorkdaysBetween(startDate, resetDate, holidays)
  const count = Math.min(remainingDays, workdays.length)
  if (count === 0) return { leaveDates: [], periods: [] }

  const segmentSize = Math.floor(workdays.length / count)
  const leaveDates: Date[] = []

  for (let i = 0; i < count; i++) {
    const segStart = i * segmentSize
    const segEnd = i === count - 1 ? workdays.length - 1 : (i + 1) * segmentSize - 1
    const segment = workdays.slice(segStart, segEnd + 1)

    const friday = segment.find(d => d.getDay() === 5)
    const monday = segment.find(d => d.getDay() === 1)
    leaveDates.push(friday ?? monday ?? segment[segment.length - 1])
  }

  const periods = buildPeriods(leaveDates, holidays)
  return { leaveDates, periods }
}

function buildPeriods(leaveDates: Date[], holidays: HolidayMap): LeavePeriod[] {
  const leaveSet = new Set(leaveDates.map(toDateStr))
  const periods: LeavePeriod[] = []

  for (const leaveDate of leaveDates) {
    let start = leaveDate
    let end = leaveDate

    while (isRestDay(addDays(start, -1), holidays) || leaveSet.has(toDateStr(addDays(start, -1)))) {
      start = addDays(start, -1)
    }
    while (isRestDay(addDays(end, 1), holidays) || leaveSet.has(toDateStr(addDays(end, 1)))) {
      end = addDays(end, 1)
    }

    const days = eachDayInRange(start, end)
    const leaveDaysInPeriod = days.filter(d => leaveSet.has(toDateStr(d))).length

    periods.push({
      start,
      end,
      leaveDays: leaveDaysInPeriod,
      totalDays: days.length,
      label: buildPeriodLabel(start, end),
    })
  }

  const seen = new Set<string>()
  return periods.filter(p => {
    const key = `${toDateStr(p.start)}-${toDateStr(p.end)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
