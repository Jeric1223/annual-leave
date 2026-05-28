import { addDays, isWorkday, isRestDay, toDateStr, eachDayInRange, buildPeriodLabel } from './utils'
import type { HolidayMap, LeaveRecommendation, LeavePeriod } from './types'

interface Input { remainingDays: number; resetDate: Date; startDate: Date; holidays: HolidayMap }

export function minLeaveMaxRest({ remainingDays, resetDate, startDate, holidays }: Input): LeaveRecommendation {
  const candidates: { leaveDates: Date[]; period: LeavePeriod; totalDays: number }[] = []
  const current = new Date(startDate)

  while (current <= resetDate) {
    if (!isWorkday(current, holidays)) { current.setDate(current.getDate() + 1); continue }

    for (let len = 1; len <= Math.min(remainingDays, 5); len++) {
      const leave: Date[] = []
      let ok = true
      for (let i = 0; i < len; i++) {
        const d = addDays(current, i)
        if (d > resetDate || !isWorkday(d, holidays)) { ok = false; break }
        leave.push(new Date(d))
      }
      if (!ok) break

      let s = leave[0]; let e = leave[leave.length - 1]
      while (isRestDay(addDays(s, -1), holidays)) s = addDays(s, -1)
      while (isRestDay(addDays(e, 1), holidays)) e = addDays(e, 1)

      const days = eachDayInRange(s, e)
      const totalDays = days.length
      if (totalDays > len) {
        candidates.push({ leaveDates: leave, period: { start: s, end: e, leaveDays: len, totalDays, label: buildPeriodLabel(s, e) }, totalDays })
      }
    }
    current.setDate(current.getDate() + 1)
  }

  candidates.sort((a, b) => b.totalDays - a.totalDays || a.leaveDates[0].getTime() - b.leaveDates[0].getTime())
  const selected: typeof candidates = []
  const usedDates = new Set<string>()
  let usedDays = 0

  for (const c of candidates) {
    if (selected.length >= 5) break
    if (usedDays + c.leaveDates.length > remainingDays) continue
    if (c.leaveDates.some(d => usedDates.has(toDateStr(d)))) continue
    selected.push(c)
    usedDays += c.leaveDates.length
    c.leaveDates.forEach(d => usedDates.add(toDateStr(d)))
  }

  return { leaveDates: selected.flatMap(c => c.leaveDates), periods: selected.map(c => c.period) }
}
