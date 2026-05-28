import type { HolidayMap } from '../algorithms/types'

const FALLBACK_HOLIDAYS: HolidayMap = {
  '2025-01-01': '신정', '2025-01-28': '설날', '2025-01-29': '설날', '2025-01-30': '설날',
  '2025-03-01': '삼일절', '2025-05-05': '어린이날', '2025-05-06': '대체공휴일',
  '2025-06-06': '현충일', '2025-08-15': '광복절',
  '2025-10-03': '개천절', '2025-10-05': '추석', '2025-10-06': '추석', '2025-10-07': '추석',
  '2025-10-08': '대체공휴일', '2025-10-09': '한글날', '2025-12-25': '크리스마스',
  '2026-01-01': '신정', '2026-02-17': '설날', '2026-02-18': '설날', '2026-02-19': '설날',
  '2026-03-01': '삼일절', '2026-05-05': '어린이날',
  '2026-06-06': '현충일', '2026-08-15': '광복절',
  '2026-09-24': '추석', '2026-09-25': '추석', '2026-09-26': '추석',
  '2026-10-03': '개천절', '2026-10-09': '한글날', '2026-12-25': '크리스마스',
}

interface ApiItem {
  locdate: number
  dateName: string
}

async function fetchHolidaysFromApi(year: number): Promise<HolidayMap> {
  const key = import.meta.env.VITE_HOLIDAY_API_KEY
  if (!key || key === 'YOUR_KEY_HERE') throw new Error('API key not set')

  const map: HolidayMap = {}
  for (let month = 1; month <= 12; month++) {
    const mm = String(month).padStart(2, '0')
    const params = new URLSearchParams({
      serviceKey: key,
      solYear: String(year),
      solMonth: mm,
      _type: 'json',
      numOfRows: '20',
    })
    const res = await fetch(`/api/holidays?${params}`)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const json = await res.json()
    const items: ApiItem[] = json?.response?.body?.items?.item ?? []
    const list = Array.isArray(items) ? items : [items]
    for (const item of list) {
      const d = String(item.locdate)
      const dateStr = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`
      map[dateStr] = item.dateName
    }
  }
  return map
}

export async function getHolidays(year: number): Promise<{ data: HolidayMap; fromFallback: boolean }> {
  const cacheKey = `holidays_${year}`
  const cached = sessionStorage.getItem(cacheKey)
  if (cached) return { data: JSON.parse(cached), fromFallback: false }

  try {
    const data = await fetchHolidaysFromApi(year)
    sessionStorage.setItem(cacheKey, JSON.stringify(data))
    return { data, fromFallback: false }
  } catch {
    return { data: FALLBACK_HOLIDAYS, fromFallback: true }
  }
}
