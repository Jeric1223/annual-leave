import { describe, it, expect } from 'vitest'
import { goldenHoliday } from '../goldenHoliday'

const holidays = {
  '2025-05-05': '어린이날', '2025-05-06': '대체공휴일',
  '2025-10-03': '개천절', '2025-10-05': '추석', '2025-10-06': '추석', '2025-10-07': '추석',
}

describe('goldenHoliday', () => {
  it('달별 최대 연휴 랭킹 반환', () => {
    const result = goldenHoliday({
      remainingDays: 5,
      resetDate: new Date('2025-12-31'),
      startDate: new Date('2025-01-01'),
      holidays,
    })
    expect(result.leaveDates.length).toBeGreaterThan(0)
    expect(result.periods.length).toBeGreaterThan(0)
  })

  it('공휴일 밀도 높은 달(5월, 10월)이 앞에 배치', () => {
    const result = goldenHoliday({
      remainingDays: 5,
      resetDate: new Date('2025-12-31'),
      startDate: new Date('2025-01-01'),
      holidays,
    })
    const months = result.periods.map(p => p.start.getMonth() + 1)
    expect([5, 10]).toContain(months[0])
  })
})
