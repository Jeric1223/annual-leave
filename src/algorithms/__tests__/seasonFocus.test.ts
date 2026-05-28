import { describe, it, expect } from 'vitest'
import { seasonFocus } from '../seasonFocus'

const holidays = { '2025-08-15': '광복절' }

describe('seasonFocus', () => {
  it('여름 시즌(7~8월) 내 날짜만 추천', () => {
    const result = seasonFocus({
      remainingDays: 5,
      resetDate: new Date('2025-12-31'),
      startDate: new Date('2025-01-01'),
      holidays,
      season: 'summer',
    })
    result.leaveDates.forEach(d => {
      expect([6, 7]).toContain(d.getMonth())
    })
  })

  it('겨울 시즌(12~1월) 내 날짜만 추천', () => {
    const result = seasonFocus({
      remainingDays: 5,
      resetDate: new Date('2026-01-31'),
      startDate: new Date('2025-12-01'),
      holidays: { '2025-12-25': '크리스마스' },
      season: 'winter',
    })
    result.leaveDates.forEach(d => {
      expect([11, 0]).toContain(d.getMonth())
    })
  })
})
