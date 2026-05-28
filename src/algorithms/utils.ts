import { format, addDays as dateFnsAddDays, eachDayOfInterval, isWeekend as dateFnsIsWeekend } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { HolidayMap } from './types'

export function toDateStr(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function isWeekend(date: Date): boolean {
  return dateFnsIsWeekend(date)
}

export function isHoliday(date: Date, holidays: HolidayMap): boolean {
  return toDateStr(date) in holidays
}

export function isWorkday(date: Date, holidays: HolidayMap): boolean {
  return !isWeekend(date) && !isHoliday(date, holidays)
}

export function isRestDay(date: Date, holidays: HolidayMap): boolean {
  return isWeekend(date) || isHoliday(date, holidays)
}

export function addDays(date: Date, n: number): Date {
  return dateFnsAddDays(date, n)
}

export function eachDayInRange(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end })
}

export function getWorkdaysBetween(start: Date, end: Date, holidays: HolidayMap): Date[] {
  return eachDayInRange(start, end).filter(d => isWorkday(d, holidays))
}

export function formatDateLabel(date: Date): string {
  return format(date, 'M/d(EEE)', { locale: ko })
}

export function buildPeriodLabel(start: Date, end: Date): string {
  return `${formatDateLabel(start)} ~ ${formatDateLabel(end)}`
}
