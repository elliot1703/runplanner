export type Tier = 'A' | 'B' | 'C' | 'D'
export type Frequency = 'twice-weekly' | 'weekly' | 'fortnightly' | 'monthly'

export interface Store {
  id: string
  name: string
  suburb: string
  address?: string
  lat?: number
  lng?: number
  tier: Tier
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

export const TIER_COLORS: Record<Tier, string> = {
  A: 'bg-red-600 text-white',
  B: 'bg-amber-500 text-white',
  C: 'bg-blue-500 text-white',
  D: 'bg-gray-500 text-white',
}

export const TIER_BORDER_COLORS: Record<Tier, string> = {
  A: 'border-red-600',
  B: 'border-amber-500',
  C: 'border-blue-500',
  D: 'border-gray-500',
}

export const TIER_TEXT_COLORS: Record<Tier, string> = {
  A: 'text-red-600',
  B: 'text-amber-500',
  C: 'text-blue-500',
  D: 'text-gray-500',
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
