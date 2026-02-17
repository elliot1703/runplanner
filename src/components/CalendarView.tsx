import { useState, useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  getDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isToday,
  isSameMonth,
} from 'date-fns'
import type { Store, MonthPlan, DayPlan } from '../types'
import { GRADE_CHIP_COLORS, FREQUENCY_LABELS } from '../types'
import { GradeBadge } from './GradeBadge'
import { getSettings } from '../storage'

type ViewMode = 'month' | 'week' | 'day'

interface CalendarViewProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  plan: MonthPlan | null
  stores: Store[]
  onDayClick: (date: string, dayPlan?: DayPlan) => void
  onToggleBlock: (date: string) => void
}

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function CalendarView({
  currentDate,
  onDateChange,
  plan,
  stores,
  onDayClick,
  onToggleBlock,
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const settings = getSettings()

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

  // Navigation handlers per view mode
  function handlePrev() {
    if (viewMode === 'month') onDateChange(subMonths(currentDate, 1))
    else if (viewMode === 'week') onDateChange(subWeeks(currentDate, 1))
    else onDateChange(subDays(currentDate, 1))
  }

  function handleNext() {
    if (viewMode === 'month') onDateChange(addMonths(currentDate, 1))
    else if (viewMode === 'week') onDateChange(addWeeks(currentDate, 1))
    else onDateChange(addDays(currentDate, 1))
  }

  // Header text per view mode
  function getHeaderText() {
    if (viewMode === 'month') return format(currentDate, 'MMMM yyyy')
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
      if (isSameMonth(weekStart, weekEnd)) {
        return `${format(weekStart, 'd')} \u2013 ${format(weekEnd, 'd MMM yyyy')}`
      }
      return `${format(weekStart, 'd MMM')} \u2013 ${format(weekEnd, 'd MMM yyyy')}`
    }
    return format(currentDate, 'EEEE, d MMMM yyyy')
  }

  return (
    <div className="flex flex-col h-full bg-[#faf9f6]">
      {/* View mode switcher */}
      <div className="flex gap-0.5 bg-[#e8e2d8] rounded-xl p-0.5 mx-5 mt-3">
        {(['month', 'week', 'day'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-[10px] transition-all capitalize ${
              viewMode === mode
                ? 'bg-white text-[#3d3529] shadow-sm'
                : 'text-[#847a6e]'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-xl active:bg-[#f5eeea] text-[#847a6e] transition-colors"
        >
          &larr;
        </button>
        <h1 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#3d3529]">
          {getHeaderText()}
        </h1>
        <button
          onClick={handleNext}
          className="p-2 rounded-xl active:bg-[#f5eeea] text-[#847a6e] transition-colors"
        >
          &rarr;
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-20">
        {viewMode === 'month' && (
          <MonthGrid
            currentDate={currentDate}
            settings={settings}
            storeMap={storeMap}
            dayPlanMap={dayPlanMap}
            plan={plan}
            onDayClick={onDayClick}
            onToggleBlock={onToggleBlock}
          />
        )}
        {viewMode === 'week' && (
          <WeekGrid
            currentDate={currentDate}
            settings={settings}
            storeMap={storeMap}
            dayPlanMap={dayPlanMap}
            plan={plan}
            onDayClick={onDayClick}
            onToggleBlock={onToggleBlock}
          />
        )}
        {viewMode === 'day' && (
          <DayDetail
            currentDate={currentDate}
            settings={settings}
            storeMap={storeMap}
            dayPlanMap={dayPlanMap}
            plan={plan}
            onDayClick={onDayClick}
            onToggleBlock={onToggleBlock}
          />
        )}
      </div>
    </div>
  )
}

// ============================================================
// MONTH GRID (existing behavior)
// ============================================================
interface GridProps {
  currentDate: Date
  settings: { workDays: number[] }
  storeMap: Map<string, Store>
  dayPlanMap: Map<string, DayPlan>
  plan: MonthPlan | null
  onDayClick: (date: string, dayPlan?: DayPlan) => void
  onToggleBlock: (date: string) => void
}

function getMondayBasedDay(date: Date): number {
  const d = getDay(date)
  return d === 0 ? 6 : d - 1
}

function MonthGrid({ currentDate, settings, storeMap, dayPlanMap, plan, onDayClick, onToggleBlock }: GridProps) {
  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) })
  }, [currentDate])

  return (
    <>
      <div className="grid grid-cols-7 px-0 mb-1">
        {DAY_HEADERS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-[#847a6e] py-1 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-[#e8e2d8] rounded-2xl overflow-hidden">
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
              onClick={() => { if (isWorkDay && visits.length > 0) onDayClick(dateStr, dayPlan) }}
              onDoubleClick={() => { if (isWorkDay) onToggleBlock(dateStr) }}
              className={`min-h-[80px] p-1.5 transition-colors ${
                isBlocked ? 'bg-[#e8e2d8]' : isWorkDay ? 'bg-white' : 'bg-[#f5f2ee]'
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
                  <div key={i} className={`text-[10px] leading-tight truncate px-1.5 py-0.5 rounded-lg mb-0.5 font-bold ${GRADE_CHIP_COLORS[store.grade]}`}>
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
    </>
  )
}

// ============================================================
// WEEK GRID
// ============================================================
function WeekGrid({ currentDate, settings, storeMap, dayPlanMap, plan, onDayClick, onToggleBlock }: GridProps) {
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
    const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
    // Filter to only work days
    return allDays.filter(d => settings.workDays.includes(getDay(d)))
  }, [currentDate, settings.workDays])

  const colCount = weekDays.length || 1

  return (
    <>
      <div className={`grid gap-2.5`} style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}>
        {/* Day headers */}
        {weekDays.map(day => {
          const today = isToday(day)
          return (
            <div key={format(day, 'yyyy-MM-dd')} className="text-center pb-1">
              <div className={`text-[11px] font-bold uppercase tracking-wide ${today ? 'text-[#5c4033]' : 'text-[#847a6e]'}`}>
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-bold ${today ? 'text-[#5c4033]' : 'text-[#3d3529]'}`}>
                {format(day, 'd')}
              </div>
            </div>
          )
        })}

        {/* Day columns */}
        {weekDays.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayPlan = dayPlanMap.get(dateStr)
          const isBlocked = dayPlan?.isBlocked || plan?.blockedDays.includes(dateStr)
          const visits = dayPlan?.stores || []
          const today = isToday(day)

          return (
            <div
              key={`col-${dateStr}`}
              onClick={() => { if (visits.length > 0) onDayClick(dateStr, dayPlan) }}
              onDoubleClick={() => onToggleBlock(dateStr)}
              className={`rounded-2xl border transition-all min-h-[200px] p-2.5 flex flex-col gap-1.5 ${
                isBlocked
                  ? 'bg-[#e8e2d8] border-[#e8e2d8]'
                  : 'bg-white border-[#e8e2d8] hover:border-[#d4cdc4] hover:shadow-sm'
              } ${today ? 'ring-2 ring-[#5c4033] ring-offset-1' : ''} ${
                visits.length > 0 ? 'cursor-pointer active:bg-[#faf9f6]' : ''
              }`}
            >
              {isBlocked && (
                <div className="text-[10px] font-bold text-[#b5462a] uppercase tracking-wide">Blocked</div>
              )}
              {visits.map((visit, i) => {
                const store = storeMap.get(visit.storeId)
                if (!store) return null
                return (
                  <div
                    key={i}
                    className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl truncate ${GRADE_CHIP_COLORS[store.grade]}`}
                  >
                    {store.name}
                  </div>
                )
              })}
              {visits.length === 0 && !isBlocked && (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-[11px] text-[#847a6e] font-medium">No visits</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

// ============================================================
// DAY DETAIL
// ============================================================
function DayDetail({ currentDate, settings, storeMap, dayPlanMap, plan, onToggleBlock }: GridProps) {
  const dateStr = format(currentDate, 'yyyy-MM-dd')
  const dayPlan = dayPlanMap.get(dateStr)
  const isBlocked = dayPlan?.isBlocked || plan?.blockedDays.includes(dateStr)
  const isWorkDay = settings.workDays.includes(getDay(currentDate))
  const visits = dayPlan?.stores ? [...dayPlan.stores].sort((a, b) => a.order - b.order) : []
  const today = isToday(currentDate)

  return (
    <div className="space-y-3">
      {/* Day status bar */}
      <div className={`rounded-2xl p-4 border ${
        today ? 'border-[#5c4033] bg-[#f5eeea]' : 'border-[#e8e2d8] bg-white'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-sm font-bold ${today ? 'text-[#5c4033]' : 'text-[#3d3529]'}`}>
              {today ? 'Today' : format(currentDate, 'EEEE')}
            </div>
            <div className="text-xs text-[#847a6e] font-medium mt-0.5">
              {visits.length} visit{visits.length !== 1 ? 's' : ''}
              {dayPlan?.totalEstimatedDriveMin ? ` \u00b7 ~${dayPlan.totalEstimatedDriveMin} min drive` : ''}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isBlocked && (
              <span className="text-xs font-bold text-[#b5462a] bg-[#b5462a]/10 px-2.5 py-1 rounded-lg">Blocked</span>
            )}
            {!isWorkDay && (
              <span className="text-xs font-bold text-[#847a6e] bg-[#f5f2ee] px-2.5 py-1 rounded-lg">Day off</span>
            )}
            {isWorkDay && (
              <button
                onClick={() => onToggleBlock(dateStr)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  isBlocked
                    ? 'bg-[#527a3a]/10 text-[#527a3a]'
                    : 'bg-[#b5462a]/10 text-[#b5462a]'
                }`}
              >
                {isBlocked ? 'Unblock' : 'Block day'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Visit list */}
      {visits.length > 0 ? (
        <div className="space-y-2">
          {visits.map((visit, i) => {
            const store = storeMap.get(visit.storeId)
            if (!store) return null

            return (
              <div
                key={visit.storeId}
                className="bg-white rounded-2xl border border-[#e8e2d8] p-4 flex items-start gap-3.5 hover:border-[#d4cdc4] hover:shadow-sm transition-all animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="w-8 h-8 rounded-xl bg-[#5c4033] text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <GradeBadge grade={store.grade} size="sm" />
                    <span className="font-bold text-[15px] text-[#3d3529] truncate">{store.name}</span>
                  </div>
                  <div className="text-xs text-[#847a6e] font-medium">
                    {store.suburb} &middot; {FREQUENCY_LABELS[store.frequency]}
                  </div>
                  <div className="flex gap-3 mt-1.5 text-xs font-bold">
                    {store.monthlySpend > 0 && (
                      <span className="text-[#5c4033]">${store.monthlySpend.toLocaleString()}/mo</span>
                    )}
                    {store.newLinesThisMonth > 0 ? (
                      <span className="text-[#527a3a]">{store.newLinesThisMonth} new lines</span>
                    ) : (
                      <span className="text-[#b5462a]">0 new lines</span>
                    )}
                    {visit.estimatedArrival && (
                      <span className="text-[#847a6e]">ETA: {visit.estimatedArrival}</span>
                    )}
                  </div>
                  {store.notes && (
                    <p className="text-xs text-[#8a6240] mt-1.5 bg-[#f8f2ea] px-2.5 py-1 rounded-lg font-medium">
                      {store.notes}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#e8e2d8] p-8 text-center">
          <p className="text-[#847a6e] font-semibold">
            {isBlocked ? 'This day is blocked' : !isWorkDay ? 'Day off' : 'No visits scheduled'}
          </p>
        </div>
      )}
    </div>
  )
}
