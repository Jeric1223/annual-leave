import { describe, it, expect } from 'vitest'
import { evenDistribution } from '../evenDistribution'
import type { HolidayMap } from '../types'

const holidays: HolidayMap = { '2025-05-05': '어린이날' }

describe('evenDistribution', () => {
  it('연차 5일을 2025-03-03부터 2025-06-30 사이에 균등 배치', () => {
    const result = evenDistribution({
      remainingDays: 5,
      resetDate: new Date('2025-06-30'),
      startDate: new Date('2025-03-03'),
      holidays,
    })
    expect(result.leaveDates).toHaveLength(5)
    expect(result.periods.length).toBeGreaterThan(0)
  })

  it('연차보다 평일이 적으면 남은 평일만큼만 추천', () => {
    const result = evenDistribution({
      remainingDays: 100,
      resetDate: new Date('2025-03-07'),
      startDate: new Date('2025-03-03'),
      holidays,
    })
    expect(result.leaveDates.length).toBeLessThanOrEqual(5)
  })

  it('추천 날짜가 모두 평일', () => {
    const result = evenDistribution({
      remainingDays: 5,
      resetDate: new Date('2025-06-30'),
      startDate: new Date('2025-03-03'),
      holidays,
    })
    result.leaveDates.forEach(d => {
      expect([0, 6]).not.toContain(d.getDay())
    })
  })
})
