import { getWorkdaysBetween, toDateStr, addDays, eachDayInRange, buildPeriodLabel, isRestDay } from './utils'
import type { HolidayMap, LeaveRecommendation, LeavePeriod, Season } from './types'

interface Input { remainingDays: number; resetDate: Date; startDate: Date; holidays: HolidayMap; season: Season }

export function seasonFocus({ remainingDays, resetDate, startDate, holidays, season }: Input): LeaveRecommendation {
  const year = startDate.getFullYear()
  const ranges = season === 'summer'
    ? [[new Date(year, 6, 1), new Date(year, 7, 31)]]
    : [[new Date(year, 11, 1), new Date(year, 11, 31)], [new Date(year + 1, 0, 1), new Date(year + 1, 0, 31)]]

  const leaveDates: Date[] = []
  const usedDates = new Set<string>()

  for (const [rs, re] of ranges) {
    const rangeStart = new Date(Math.max(rs.getTime(), startDate.getTime()))
    const rangeEnd = new Date(Math.min(re.getTime(), resetDate.getTime()))
    if (rangeStart > rangeEnd) continue

    const workdays = getWorkdaysBetween(rangeStart, rangeEnd, holidays)
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
  const periods: LeavePeriod[] = []

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
