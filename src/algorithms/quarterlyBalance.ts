import { getWorkdaysBetween, toDateStr, addDays, eachDayInRange, buildPeriodLabel, isRestDay } from './utils'
import type { HolidayMap, LeaveRecommendation, LeavePeriod } from './types'

interface Input { remainingDays: number; resetDate: Date; startDate: Date; holidays: HolidayMap }

const QUARTERS = [[1,3],[4,6],[7,9],[10,12]]

export function quarterlyBalance({ remainingDays, resetDate, startDate, holidays }: Input): LeaveRecommendation {
  const year = startDate.getFullYear()
  const perQuarter = Math.ceil(remainingDays / 4)
  const leaveDates: Date[] = []
  const periods: LeavePeriod[] = []
  const usedDates = new Set<string>()
  let remaining = remainingDays

  for (const [startM, endM] of QUARTERS) {
    if (remaining <= 0) break
    const qStart = new Date(Math.max(new Date(year, startM - 1, 1).getTime(), startDate.getTime()))
    const qEnd = new Date(Math.min(new Date(year, endM, 0).getTime(), resetDate.getTime()))
    if (qStart > qEnd) continue

    const workdays = getWorkdaysBetween(qStart, qEnd, holidays)
    const preferred = workdays.filter(w => [1, 5].includes(w.getDay()))
    const candidates = [...preferred, ...workdays.filter(w => ![1, 5].includes(w.getDay()))]
    const toPlace = Math.min(perQuarter, remaining)
    let placed = 0

    for (const wd of candidates) {
      if (placed >= toPlace) break
      if (usedDates.has(toDateStr(wd))) continue
      leaveDates.push(new Date(wd))
      usedDates.add(toDateStr(wd))
      placed++
      remaining--
    }
  }

  leaveDates.sort((a, b) => a.getTime() - b.getTime())
  const leaveSet = new Set(leaveDates.map(toDateStr))
  for (const ld of leaveDates) {
    let s = ld; let e = ld
    while (isRestDay(addDays(s, -1), holidays) || leaveSet.has(toDateStr(addDays(s, -1)))) s = addDays(s, -1)
    while (isRestDay(addDays(e, 1), holidays) || leaveSet.has(toDateStr(addDays(e, 1)))) e = addDays(e, 1)
    const key = `${toDateStr(s)}-${toDateStr(e)}`
    if (!periods.find(p => `${toDateStr(p.start)}-${toDateStr(p.end)}` === key)) {
      const days = eachDayInRange(s, e)
      periods.push({ start: s, end: e, leaveDays: days.filter(d => leaveSet.has(toDateStr(d))).length, totalDays: days.length, label: buildPeriodLabel(s, e) })
    }
  }

  return { leaveDates, periods }
}
