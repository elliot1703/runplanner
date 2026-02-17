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
import { GRADE_CHIP_COLORS } from '../types'
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

  function getMondayBasedDay(date: Date): number {
    const d = getDay(date)
    return d === 0 ? 6 : d - 1
  }

  return (
    <div className="flex flex-col h-full bg-[#faf9f6]">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <button
          onClick={() => onDateChange(subMonths(currentDate, 1))}
          className="p-2 rounded-xl active:bg-[#f5eeea] text-[#847a6e] transition-colors"
        >
          &larr;
        </button>
        <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#3d3529]">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        <button
          onClick={() => onDateChange(addMonths(currentDate, 1))}
          className="p-2 rounded-xl active:bg-[#f5eeea] text-[#847a6e] transition-colors"
        >
          &rarr;
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-3">
        {DAY_HEADERS.map(d => (
          <div
            key={d}
            className="text-center text-[11px] font-bold text-[#847a6e] py-1 uppercase tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto px-3 pb-20">
        <div className="grid grid-cols-7 gap-px bg-[#e8e2d8] rounded-2xl overflow-hidden">
          {/* Leading empty cells */}
          {Array.from({ length: getMondayBasedDay(calendarDays[0]) }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-[#f5f2ee] min-h-[80px]" />
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
                className={`min-h-[80px] p-1.5 transition-colors ${
                  isBlocked
                    ? 'bg-[#e8e2d8]'
                    : isWorkDay
                      ? 'bg-white'
                      : 'bg-[#f5f2ee]'
                } ${today ? 'ring-2 ring-[#5c4033] ring-inset' : ''} ${
                  visits.length > 0 && isWorkDay ? 'cursor-pointer active:bg-[#faf9f6]' : ''
                }`}
              >
                <div className={`text-[11px] font-bold mb-0.5 ${
                  today ? 'text-[#5c4033]' : isWorkDay ? 'text-[#3d3529]' : 'text-[#847a6e]'
                }`}>
                  {format(day, 'd')}
                  {isBlocked && <span className="ml-1 text-[#b5462a] text-[9px]">blocked</span>}
                </div>
                {visits.slice(0, 4).map((visit, i) => {
                  const store = storeMap.get(visit.storeId)
                  if (!store) return null
                  return (
                    <div
                      key={i}
                      className={`text-[10px] leading-tight truncate px-1.5 py-0.5 rounded-lg mb-0.5 font-bold ${GRADE_CHIP_COLORS[store.grade]}`}
                    >
                      {store.name}
                    </div>
                  )
                })}
                {visits.length > 4 && (
                  <div className="text-[10px] text-[#847a6e] px-1 font-semibold">+{visits.length - 4} more</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
