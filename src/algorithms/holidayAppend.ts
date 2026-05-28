import { addDays, isWorkday, isRestDay, toDateStr, eachDayInRange, buildPeriodLabel } from './utils'
import type { HolidayMap, LeaveRecommendation, LeavePeriod } from './types'

interface Input {
  remainingDays: number
  resetDate: Date
  startDate: Date
  holidays: HolidayMap
}

interface Candidate {
  leaveDates: Date[]
  period: LeavePeriod
  efficiency: number
}

export function holidayAppend({ remainingDays, resetDate, startDate, holidays }: Input): LeaveRecommendation {
  const candidates = findCandidates(startDate, resetDate, holidays)
  candidates.sort((a, b) => b.efficiency - a.efficiency)

  const selected: Candidate[] = []
  let usedDays = 0
  const usedDates = new Set<string>()

  for (const c of candidates) {
    if (usedDays + c.leaveDates.length > remainingDays) continue
    if (c.leaveDates.some(d => usedDates.has(toDateStr(d)))) continue
    selected.push(c)
    usedDays += c.leaveDates.length
    c.leaveDates.forEach(d => usedDates.add(toDateStr(d)))
    if (usedDays >= remainingDays) break
  }

  return {
    leaveDates: selected.flatMap(c => c.leaveDates),
    periods: selected.map(c => c.period),
  }
}

function findCandidates(startDate: Date, endDate: Date, holidays: HolidayMap): Candidate[] {
  const candidates: Candidate[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    if (!isWorkday(current, holidays)) {
      current.setDate(current.getDate() + 1)
      continue
    }

    const prevIsRest = isRestDay(addDays(current, -1), holidays)
    const nextIsRest = isRestDay(addDays(current, 1), holidays)

    if (prevIsRest || nextIsRest) {
      const leaveDates = [new Date(current)]

      for (let extra = 1; extra <= 2; extra++) {
        const next = addDays(current, extra)
        if (next > endDate) break
        if (isWorkday(next, holidays)) leaveDates.push(new Date(next))
        else break
      }

      for (let len = 1; len <= leaveDates.length; len++) {
        const leave = leaveDates.slice(0, len)
        const rangeStart = findRangeStart(leave[0], holidays)
        const rangeEnd = findRangeEnd(leave[leave.length - 1], holidays)
        const totalDays = eachDayInRange(rangeStart, rangeEnd).length
        const efficiency = totalDays / leave.length

        if (efficiency > 1) {
          candidates.push({
            leaveDates: leave.map(d => new Date(d)),
            period: {
              start: rangeStart,
              end: rangeEnd,
              leaveDays: leave.length,
              totalDays,
              label: buildPeriodLabel(rangeStart, rangeEnd),
            },
            efficiency,
          })
        }
      }
    }

    current.setDate(current.getDate() + 1)
  }

  return candidates
}

function findRangeStart(date: Date, holidays: HolidayMap): Date {
  let d = addDays(date, -1)
  while (isRestDay(d, holidays)) d = addDays(d, -1)
  return addDays(d, 1)
}

function findRangeEnd(date: Date, holidays: HolidayMap): Date {
  let d = addDays(date, 1)
  while (isRestDay(d, holidays)) d = addDays(d, 1)
  return addDays(d, -1)
}
