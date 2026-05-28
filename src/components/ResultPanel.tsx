import { useState } from 'react'
import type { LeaveRecommendation, HolidayMap } from '../algorithms/types'
import { ListView } from './ListView'
import { CalendarView } from './CalendarView'

interface Props {
  result: LeaveRecommendation | null
  holidays: HolidayMap
  resetDate: Date | null
  loading: boolean
  fromFallback: boolean
}

type Tab = 'calendar' | 'list'

export function ResultPanel({ result, holidays, resetDate, loading, fromFallback }: Props) {
  const [tab, setTab] = useState<Tab>('list')

  return (
    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
      {/* Fallback warning */}
      {fromFallback && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <span className="mt-0.5">⚠️</span>
          <span>공휴일 데이터를 불러오지 못해 내장 데이터를 사용하고 있습니다. 일부 공휴일이 누락될 수 있습니다.</span>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <div className="w-4 h-4 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
          <span>공휴일 데이터 로딩 중...</span>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
          <div className="text-5xl mb-4">🌴</div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">연차를 계산해보세요</h2>
          <p className="text-sm text-gray-400 max-w-xs">
            남은 연차 일수와 초기화 날짜를 입력하고<br />
            원하는 방식을 선택한 뒤 계산하기를 누르세요
          </p>
        </div>
      )}

      {/* Results */}
      {result && resetDate && (
        <div>
          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
            {(['list', 'calendar'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  tab === t
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t === 'list' ? '리스트' : '캘린더'}
              </button>
            ))}
          </div>

          {/* Content */}
          {tab === 'list' ? (
            <ListView result={result} />
          ) : (
            <CalendarView result={result} holidays={holidays} resetDate={resetDate} />
          )}
        </div>
      )}
    </main>
  )
}
