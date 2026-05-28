import type { AlgorithmMode, LeaveInput, Season } from '../algorithms/types'

const MODES: AlgorithmMode[] = ['even', 'append', 'golden', 'minmax', 'quarterly', 'season']

export function encodeState(input: Partial<LeaveInput>): string {
  const params = new URLSearchParams()
  if (input.remainingDays != null) params.set('days', String(input.remainingDays))
  if (input.resetDate) params.set('reset', input.resetDate.toISOString().slice(0, 10))
  if (input.mode) params.set('mode', input.mode)
  if (input.season) params.set('season', input.season)
  return params.toString()
}

export function decodeState(): Partial<LeaveInput> {
  const params = new URLSearchParams(window.location.search)
  const result: Partial<LeaveInput> = {}

  const days = params.get('days')
  if (days && !isNaN(Number(days))) result.remainingDays = Number(days)

  const reset = params.get('reset')
  if (reset) {
    const d = new Date(reset)
    if (!isNaN(d.getTime())) result.resetDate = d
  }

  const mode = params.get('mode') as AlgorithmMode
  if (mode && MODES.includes(mode)) result.mode = mode

  const season = params.get('season') as Season
  if (season === 'summer' || season === 'winter') result.season = season

  return result
}

export function pushState(input: Partial<LeaveInput>): void {
  const qs = encodeState(input)
  window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
}
