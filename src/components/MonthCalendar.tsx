import { useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns'
import type { Store, MonthPlan, DayPlan } from '../types'
import { TIER_COLORS } from '../types'
import { getSettings } from '../storage'

interface MonthCalendarProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  plan: MonthPlan | null
  stores: Store[]
  onDayClick: (date: string, dayPlan?: DayPlan) => void
  onToggleBlock: (date: string) => void
}

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function MonthCalendar({
  currentDate,
  onDateChange,
  plan,
  stores,
  onDayClick,
  onToggleBlock,
}: MonthCalendarProps) {
  const settings = getSettings()

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentDate)
    const end = endOfMonth(currentDate)
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const storeMap = useMemo(() => {
    const map = new Map<string, Store>()
    stores.forEach(s => map.set(s.id, s))
    return map
  }, [stores])

  const dayPlanMap = useMemo(() => {
    const map = new Map<string, DayPlan>()
    plan?.days.forEach(d => map.set(d.date, d))
    return map
  }, [plan])

  // Group days into weeks (Mon=0 ... Sun=6 for grid)
  function getMondayBasedDay(date: Date): number {
    const d = getDay(date) // 0=Sun
    return d === 0 ? 6 : d - 1 // Mon=0 ... Sun=6
  }

  return (
    <div className="flex flex-col h-full">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <button
          onClick={() => onDateChange(subMonths(currentDate, 1))}
          className="p-2 rounded-lg active:bg-gray-100 text-gray-600"
        >
          &larr;
        </button>
        <h1 className="text-xl font-bold">{format(currentDate, 'MMMM yyyy')}</h1>
        <button
          onClick={() => onDateChange(addMonths(currentDate, 1))}
          className="p-2 rounded-lg active:bg-gray-100 text-gray-600"
        >
          &rarr;
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-2">
        {DAY_HEADERS.map(d => (
          <div
            key={d}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto px-2 pb-20">
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Leading empty cells */}
          {Array.from({ length: getMondayBasedDay(calendarDays[0]) }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-50 min-h-[80px]" />
          ))}

          {calendarDays.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd')
            const dayPlan = dayPlanMap.get(dateStr)
            const isBlocked = dayPlan?.isBlocked || plan?.blockedDays.includes(dateStr)
            const isWorkDay = settings.workDays.includes(getDay(day))
            const visits = dayPlan?.stores || []
            const today = isToday(day)

            return (
              <div
                key={dateStr}
                onClick={() => {
                  if (!isWorkDay) return
                  if (visits.length > 0) {
                    onDayClick(dateStr, dayPlan)
                  }
                }}
                onDoubleClick={() => {
                  if (isWorkDay) onToggleBlock(dateStr)
                }}
                className={`min-h-[80px] p-1 ${
                  isBlocked
                    ? 'bg-gray-300'
                    : isWorkDay
                      ? 'bg-white'
                      : 'bg-gray-50'
                } ${today ? 'ring-2 ring-blue-500 ring-inset' : ''} ${
                  visits.length > 0 && isWorkDay ? 'cursor-pointer active:bg-blue-50' : ''
                }`}
              >
                <div className={`text-xs font-medium mb-0.5 ${
                  today ? 'text-blue-600' : isWorkDay ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                  {isBlocked && <span className="ml-1 text-red-500">blocked</span>}
                </div>
                {visits.slice(0, 4).map((visit, i) => {
                  const store = storeMap.get(visit.storeId)
                  if (!store) return null
                  return (
                    <div
                      key={i}
                      className={`text-[10px] leading-tight truncate px-1 py-0.5 rounded mb-0.5 ${TIER_COLORS[store.tier]}`}
                    >
                      {store.name}
                    </div>
                  )
                })}
                {visits.length > 4 && (
                  <div className="text-[10px] text-gray-500 px-1">+{visits.length - 4} more</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
