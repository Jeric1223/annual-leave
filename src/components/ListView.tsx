import type { LeaveRecommendation } from '../algorithms/types'

interface Props {
  result: LeaveRecommendation
}

export function ListView({ result }: Props) {
  const { leaveDates, periods } = result

  return (
    <div>
      {/* Stats */}
      <div className="flex gap-3 mb-5">
        <div className="flex items-center gap-2 bg-accent/10 text-accent text-sm font-semibold px-4 py-2 rounded-xl">
          <span>{leaveDates.length}일 사용</span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-xl">
          <span>총 {periods.reduce((sum, p) => sum + p.totalDays, 0)}일 연휴</span>
        </div>
      </div>

      {/* Period cards */}
      <div className="space-y-3">
        {periods.map((period, i) => (
          <div
            key={i}
            className="animate-fade-in-up bg-white rounded-xl border border-gray-100 shadow-sm p-4"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">{period.label}</span>
              <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {period.totalDays}일 연휴
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              연차 {period.leaveDays}일 사용
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
