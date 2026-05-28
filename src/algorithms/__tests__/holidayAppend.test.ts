import { describe, it, expect } from 'vitest'
import { holidayAppend } from '../holidayAppend'

const holidays = { '2025-03-01': '삼일절' }

describe('holidayAppend', () => {
  it('공휴일 앞뒤 평일 이어붙이기 추천 반환', () => {
    const result = holidayAppend({
      remainingDays: 3,
      resetDate: new Date('2025-12-31'),
      startDate: new Date('2025-02-24'),
      holidays,
    })
    expect(result.leaveDates.length).toBeGreaterThan(0)
    expect(result.leaveDates.length).toBeLessThanOrEqual(3)
  })

  it('효율 높은 구간 순으로 정렬', () => {
    const result = holidayAppend({
      remainingDays: 10,
      resetDate: new Date('2025-12-31'),
      startDate: new Date('2025-01-01'),
      holidays: {
        '2025-03-01': '삼일절',
        '2025-05-05': '어린이날',
        '2025-05-06': '대체공휴일',
      },
    })
    const efficiencies = result.periods.map(p => p.totalDays / p.leaveDays)
    for (let i = 1; i < efficiencies.length; i++) {
      expect(efficiencies[i]).toBeLessThanOrEqual(efficiencies[i - 1])
    }
  })
})
