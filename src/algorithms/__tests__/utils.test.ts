import { describe, it, expect } from 'vitest'
import {
  isWeekend,
  isHoliday,
  isWorkday,
  isRestDay,
  getWorkdaysBetween,
  formatDateLabel,
  toDateStr,
  addDays,
  eachDayInRange,
  buildPeriodLabel,
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

describe('isRestDay', () => {
  it('주말은 true', () => expect(isRestDay(new Date('2025-03-01'), holidays)).toBe(true))
  it('공휴일은 true', () => expect(isRestDay(new Date('2025-05-05'), holidays)).toBe(true))
  it('평일은 false', () => expect(isRestDay(new Date('2025-03-03'), holidays)).toBe(false))
})

describe('addDays', () => {
  it('날짜에 N일을 더한다', () => {
    expect(toDateStr(addDays(new Date('2025-03-03'), 3))).toBe('2025-03-06')
  })
  it('음수를 빼면 이전 날짜', () => {
    expect(toDateStr(addDays(new Date('2025-03-03'), -1))).toBe('2025-03-02')
  })
})

describe('eachDayInRange', () => {
  it('범위 내 모든 날짜 반환', () => {
    const days = eachDayInRange(new Date('2025-03-03'), new Date('2025-03-05'))
    expect(days).toHaveLength(3)
    expect(toDateStr(days[0])).toBe('2025-03-03')
    expect(toDateStr(days[2])).toBe('2025-03-05')
  })
})

describe('buildPeriodLabel', () => {
  it('"M/D(요일) ~ M/D(요일)" 형식 반환', () => {
    const label = buildPeriodLabel(new Date('2025-03-03'), new Date('2025-03-07'))
    expect(label).toBe('3/3(월) ~ 3/7(금)')
  })
})
