import { getWorkdaysBetween, toDateStr, addDays, eachDayInRange, buildPeriodLabel, isRestDay } from './utils'
import type { HolidayMap, LeaveRecommendation, LeavePeriod } from './types'

interface Input { remainingDays: number; resetDate: Date; startDate: Date; holidays: HolidayMap }

export function goldenHoliday({ remainingDays, resetDate, startDate, holidays }: Input): LeaveRecommendation {
  const monthScores: { year: number; month: number; score: number }[] = []
  const d = new Date(startDate)
  while (d <= resetDate) {
    const y = d.getFullYear(); const m = d.getMonth() + 1
    const score = Object.keys(holidays).filter(k => k.startsWith(`${y}-${String(m).padStart(2, '0')}`)).length
    if (!monthScores.find(s => s.year === y && s.month === m)) monthScores.push({ year: y, month: m, score })
    d.setMonth(d.getMonth() + 1)
  }
  monthScores.sort((a, b) => b.score - a.score)

  const leaveDates: Date[] = []
  const periods: LeavePeriod[] = []
  const usedDates = new Set<string>()

  for (const { year, month } of monthScores) {
    if (leaveDates.length >= remainingDays) break
    const mStart = new Date(Math.max(new Date(year, month - 1, 1).getTime(), startDate.getTime()))
    const mEnd = new Date(Math.min(new Date(year, month, 0).getTime(), resetDate.getTime()))
    const workdays = getWorkdaysBetween(mStart, mEnd, holidays)

    const preferred = workdays.filter(w => [1, 5].includes(w.getDay()))
    const candidates = [...preferred, ...workdays.filter(w => ![1, 5].includes(w.getDay()))]

    for (const wd of candidates) {
      if (leaveDates.length >= remainingDays) break
      if (usedDates.has(toDateStr(wd))) continue
      leaveDates.push(new Date(wd))
      usedDates.add(toDateStr(wd))
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
