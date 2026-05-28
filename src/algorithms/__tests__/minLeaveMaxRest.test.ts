import { describe, it, expect } from 'vitest'
import { minLeaveMaxRest } from '../minLeaveMaxRest'

const holidays = { '2025-05-05': '어린이날', '2025-05-06': '대체공휴일' }

describe('minLeaveMaxRest', () => {
  it('연차 N일별 최장 연휴 TOP5 반환', () => {
    const result = minLeaveMaxRest({
      remainingDays: 5,
      resetDate: new Date('2025-12-31'),
      startDate: new Date('2025-01-01'),
      holidays,
    })
    expect(result.leaveDates.length).toBeGreaterThan(0)
  })

  it('periods가 totalDays 내림차순', () => {
    const result = minLeaveMaxRest({
      remainingDays: 5,
      resetDate: new Date('2025-12-31'),
      startDate: new Date('2025-01-01'),
      holidays,
    })
    for (let i = 1; i < result.periods.length; i++) {
      expect(result.periods[i].totalDays).toBeLessThanOrEqual(result.periods[i - 1].totalDays)
    }
  })
})
