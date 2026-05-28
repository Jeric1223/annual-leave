import { describe, it, expect } from 'vitest'
import {
  isWeekend,
  isHoliday,
  isWorkday,
  getWorkdaysBetween,
  formatDateLabel,
  toDateStr,
  addDays,
  eachDayInRange,
} from '../utils'

const holidays: Record<string, string> = {
  '2025-03-01': '삼일절',
  '2025-05-05': '어린이날',
}

describe('isWeekend', () => {
  it('토요일은 true', () => expect(isWeekend(new Date('2025-03-01'))).toBe(true))
  it('일요일은 true', () => expect(isWeekend(new Date('2025-03-02'))).toBe(true))
  it('월요일은 false', () => expect(isWeekend(new Date('2025-03-03'))).toBe(false))
})

describe('isHoliday', () => {
  it('공휴일은 true', () => expect(isHoliday(new Date('2025-03-01'), holidays)).toBe(true))
  it('평일은 false', () => expect(isHoliday(new Date('2025-03-03'), holidays)).toBe(false))
})

describe('isWorkday', () => {
  it('주말이 아닌 비공휴일 평일은 true', () => expect(isWorkday(new Date('2025-03-03'), holidays)).toBe(true))
  it('토요일은 false', () => expect(isWorkday(new Date('2025-03-01'), holidays)).toBe(false))
  it('공휴일은 false', () => expect(isWorkday(new Date('2025-05-05'), holidays)).toBe(false))
})

describe('getWorkdaysBetween', () => {
  it('월~금 5일 사이 평일 5개', () => {
    const days = getWorkdaysBetween(new Date('2025-03-03'), new Date('2025-03-07'), holidays)
    expect(days).toHaveLength(5)
  })
})

describe('formatDateLabel', () => {
  it('날짜를 "3/3(월)" 형식으로 반환', () => {
    expect(formatDateLabel(new Date('2025-03-03'))).toBe('3/3(월)')
  })
})

describe('toDateStr', () => {
  it('Date를 "YYYY-MM-DD" 문자열로 변환', () => {
    expect(toDateStr(new Date('2025-03-03'))).toBe('2025-03-03')
  })
})
