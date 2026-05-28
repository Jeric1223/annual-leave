export type AlgorithmMode =
  | 'even'          // ① 균등 분산
  | 'append'        // ② 연휴 이어붙이기
  | 'golden'        // ③ 황금연휴 스코어링
  | 'minmax'        // ④ 최소 연차 최대 연휴
  | 'quarterly'     // ⑤ 분기별 균형
  | 'season'        // ⑥ 시즌 집중

export type Season = 'summer' | 'winter'

export interface LeaveInput {
  remainingDays: number
  resetDate: Date
  mode: AlgorithmMode
  season?: Season
}

export interface HolidayMap {
  [dateStr: string]: string  // 'YYYY-MM-DD' -> 공휴일 이름
}

export interface LeaveRecommendation {
  leaveDates: Date[]
  periods: LeavePeriod[]
}

export interface LeavePeriod {
  start: Date
  end: Date
  leaveDays: number
  totalDays: number
  label: string              // "3/3(월) ~ 3/7(금)"
}
