import type { LeaveRecommendation, HolidayMap } from '../algorithms/types'

interface Props {
  result: LeaveRecommendation
  holidays: HolidayMap
  resetDate: Date
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const last = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= last; d++) {
    days.push(new Date(year, month, d))
  }
  return days
}

export function CalendarView({ result, holidays, resetDate }: Props) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const leaveSet = new Set(result.leaveDates.map((d) => formatDateKey(d)))

  // Collect months from today to resetDate
  const months: { year: number; month: number }[] = []
  const cursor = new Date(today.getFullYear(), today.getMonth(), 1)
  const endMonth = new Date(resetDate.getFullYear(), resetDate.getMonth(), 1)
  while (cursor <= endMonth) {
    months.push({ year: cursor.getFullYear(), month: cursor.getMonth() })
    cursor.setMonth(cursor.getMonth() + 1)
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex items-center gap-4 mb-6 text-xs text-gray-500 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-accent/20 border border-accent/30" />
          <span>추천 연차</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-yellow-50 border border-yellow-200" />
          <span>공휴일</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-red-50" />
          <span>주말</span>
        </div>
      </div>

      {/* Month grids */}
      <div className="space-y-8">
        {months.map(({ year, month }) => {
          const days = getDaysInMonth(year, month)
          const firstDow = new Date(year, month, 1).getDay() // 0=Sun
          const cells: (Date | null)[] = [
            ...Array(firstDow).fill(null),
            ...days,
          ]
          // Pad to complete last row
          while (cells.length % 7 !== 0) cells.push(null)

          return (
            <div key={`${year}-${month}`}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {year}년 {month + 1}월
              </h3>
              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map((wd, i) => (
                  <div
                    key={wd}
                    className={`text-center text-xs font-medium py-1 ${
                      i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
                    }`}
                  >
                    {wd}
                  </div>
                ))}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((date, idx) => {
                  if (!date) return <div key={idx} />

                  const key = formatDateKey(date)
                  const isLeave = leaveSet.has(key)
                  const isHoliday = !!holidays[key]
                  const dow = date.getDay()
                  const isWeekend = dow === 0 || dow === 6
                  const isSun = dow === 0
                  const isToday = formatDateKey(date) === formatDateKey(today)

                  let cellClass = 'w-7 h-7 mx-auto flex items-center justify-center rounded-md text-xs transition-colors cursor-default select-none '

                  if (isLeave) {
                    cellClass += 'bg-accent/20 text-accent font-semibold border border-accent/30'
                  } else if (isHoliday) {
                    cellClass += 'bg-yellow-50 text-yellow-700'
                  } else if (isWeekend) {
                    cellClass += `bg-red-50 ${isSun ? 'text-red-400' : 'text-blue-400'}`
                  } else {
                    cellClass += 'text-gray-700 hover:bg-gray-50'
                  }

                  if (isToday) {
                    cellClass += ' ring-1 ring-accent/40'
                  }

                  return (
                    <div key={idx} className="flex justify-center py-0.5">
                      <div
                        className={cellClass}
                        title={isHoliday ? holidays[key] : undefined}
                      >
                        {date.getDate()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
