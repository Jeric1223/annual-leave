import { useState } from 'react'
import type { AlgorithmMode, LeaveInput, Season } from '../algorithms/types'
import { ModeSelector } from './ModeSelector'

interface Props {
  value: Partial<LeaveInput>
  onChange: (v: Partial<LeaveInput>) => void
  onCalculate: () => void
}

export function Sidebar({ value, onChange, onCalculate }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const resetDateStr = value.resetDate
    ? value.resetDate.toISOString().slice(0, 10)
    : ''

  function handleResetDateChange(str: string) {
    if (!str) {
      onChange({ ...value, resetDate: undefined })
      return
    }
    // Parse as local date to avoid timezone issues
    const [y, m, d] = str.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    onChange({ ...value, resetDate: date })
  }

  const isValid = value.remainingDays && value.remainingDays > 0 && value.resetDate && value.mode

  const innerContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-widest text-accent uppercase">hollyday</h1>
        <p className="text-xs text-gray-400 tracking-wide mt-0.5">연차 추천 계산기</p>
      </div>

      <div className="h-px bg-gray-100 mb-5" />

      {/* Inputs */}
      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
            남은 연차
          </label>
          <input
            type="number"
            min={1}
            max={365}
            value={value.remainingDays ?? ''}
            onChange={(e) => onChange({ ...value, remainingDays: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="예: 15"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/60 bg-white"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
            초기화 날짜
          </label>
          <input
            type="date"
            value={resetDateStr}
            onChange={(e) => handleResetDateChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/60 bg-white"
          />
        </div>
      </div>

      <div className="h-px bg-gray-100 mb-5" />

      {/* Mode */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">추천 방식</p>
        <ModeSelector
          mode={value.mode ?? 'even'}
          season={value.season ?? 'summer'}
          onModeChange={(m: AlgorithmMode) => onChange({ ...value, mode: m })}
          onSeasonChange={(s: Season) => onChange({ ...value, season: s })}
        />
      </div>

      {/* Calculate button */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={onCalculate}
          disabled={!isValid}
          className="w-full bg-accent text-white font-semibold text-sm py-3 rounded-xl transition-opacity disabled:opacity-40 hover:opacity-90 active:opacity-80"
        >
          계산하기
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile accordion */}
      <div className="md:hidden bg-white border-b border-gray-100">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-full flex items-center justify-between px-5 py-4"
        >
          <div>
            <span className="text-base font-bold tracking-widest text-accent uppercase">hollyday</span>
            <span className="text-xs text-gray-400 ml-2">연차 추천 계산기</span>
          </div>
          <span className="text-gray-400 text-sm">{mobileOpen ? '▲' : '▽'}</span>
        </button>
        {mobileOpen && (
          <div className="px-5 pb-5">
            {innerContent}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] flex-shrink-0 bg-white border-r border-gray-100 min-h-screen p-6">
        {innerContent}
      </aside>
    </>
  )
}
