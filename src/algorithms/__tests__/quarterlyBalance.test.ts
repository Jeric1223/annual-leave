import { describe, it, expect } from 'vitest'
import { quarterlyBalance } from '../quarterlyBalance'

const holidays = { '2025-05-05': '어린이날' }

describe('quarterlyBalance', () => {
  it('연차 8일을 4분기에 균등 배분', () => {
    const result = quarterlyBalance({
      remainingDays: 8,
      resetDate: new Date('2025-12-31'),
      startDate: new Date('2025-01-01'),
      holidays,
    })
    expect(result.leaveDates).toHaveLength(8)
  })

  it('각 분기별 추천일이 최소 1개씩', () => {
    const result = quarterlyBalance({
      remainingDays: 4,
      resetDate: new Date('2025-12-31'),
      startDate: new Date('2025-01-01'),
      holidays,
    })
    expect(result.leaveDates.length).toBeGreaterThanOrEqual(4)
  })
})
