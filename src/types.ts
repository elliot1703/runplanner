export type Grade = 'A' | 'B' | 'C'
export type Frequency = 'twice-weekly' | 'weekly' | 'fortnightly' | 'monthly'

export interface Store {
  id: string
  name: string
  suburb: string
  address?: string
  lat?: number
  lng?: number
  grade: Grade
  frequency: Frequency
  monthlySpend: number
  newLinesThisMonth: number
  notes?: string
  rescheduledCount: number
}

export interface MonthPlan {
  id: string
  month: number
  year: number
  homeSuburb: string
  blockedDays: string[]
  days: DayPlan[]
  generatedAt: string
}

export interface DayPlan {
  date: string
  stores: PlannedVisit[]
  isBlocked: boolean
  totalEstimatedDriveMin?: number
}

export interface PlannedVisit {
  storeId: string
  order: number
  estimatedArrival?: string
}

export interface Settings {
  homeSuburb: string
  apiKey: string
  workDays: number[] // 0=Sun, 1=Mon, etc. Default [1,2,3,4]
}

// Blossom grade badge colors (Tailwind arbitrary values)
export const GRADE_COLORS: Record<Grade, string> = {
  A: 'bg-[#5c4033] text-white',
  B: 'bg-[#8a6240] text-white',
  C: 'bg-[#6b6560] text-white',
}

export const GRADE_CHIP_COLORS: Record<Grade, string> = {
  A: 'bg-[#f5eeea] text-[#5c4033]',
  B: 'bg-[#f8f2ea] text-[#7a5636]',
  C: 'bg-[#f2efeb] text-[#5c5752]',
}

export const GRADE_BORDER_COLORS: Record<Grade, string> = {
  A: 'border-[#5c4033]',
  B: 'border-[#8a6240]',
  C: 'border-[#6b6560]',
}

export const GRADE_TEXT_COLORS: Record<Grade, string> = {
  A: 'text-[#5c4033]',
  B: 'text-[#8a6240]',
  C: 'text-[#6b6560]',
}

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  'twice-weekly': '2x/week',
  'weekly': 'Weekly',
  'fortnightly': 'Fortnightly',
  'monthly': 'Monthly',
}

export const FREQUENCY_VISITS_PER_MONTH: Record<Frequency, number> = {
  'twice-weekly': 8,
  'weekly': 4,
  'fortnightly': 2,
  'monthly': 1,
}

// Legacy compat — map old 'tier' field to 'grade' for stored data
export function migrateStore(s: any): Store {
  return {
    ...s,
    grade: s.grade || s.tier || 'B',
  }
}
