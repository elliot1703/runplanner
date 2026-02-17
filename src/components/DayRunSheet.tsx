import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import type { Store, DayPlan } from '../types'
import { FREQUENCY_LABELS } from '../types'
import { GradeBadge } from './GradeBadge'
import { RouteMap } from './RouteMap'
import { getSettings } from '../storage'

interface DayRunSheetProps {
  date: string
  dayPlan: DayPlan
  stores: Store[]
  onClose: () => void
}

export function DayRunSheet({ date, dayPlan, stores, onClose }: DayRunSheetProps) {
  const storeMap = new Map(stores.map(s => [s.id, s]))
  const visits = [...dayPlan.stores].sort((a, b) => a.order - b.order)
  const settings = getSettings()

  const visitStores = useMemo(() => {
    return visits
      .map(v => storeMap.get(v.storeId))
      .filter((s): s is Store => !!s)
  }, [visits, storeMap])

  const mapContainerId = `day-map-${date}`

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-[#faf9f6] w-full max-w-lg rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e2d8]">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#3d3529]">
              {format(parseISO(date), 'EEEE, d MMM')}
            </h2>
            <p className="text-sm text-[#847a6e] font-medium">
              {visits.length} store{visits.length !== 1 ? 's' : ''}
              {dayPlan.totalEstimatedDriveMin
                ? ` \u00b7 ~${dayPlan.totalEstimatedDriveMin} min drive`
                : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl active:bg-[#f5eeea] text-[#847a6e] text-lg transition-colors"
          >
            \u2715
          </button>
        </div>

        {/* Map */}
        <div id={mapContainerId} className="h-48 bg-[#f5f2ee] relative z-0" />
        <RouteMap
          stores={visitStores}
          homeSuburb={settings.homeSuburb}
          containerId={mapContainerId}
        />

        {/* Visit list */}
        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {visits.map((visit, i) => {
            const store = storeMap.get(visit.storeId)
            if (!store) return null

            return (
              <div key={visit.storeId} className="flex items-start gap-3.5 py-3 border-b border-[#e8e2d8] last:border-0">
                <div className="w-8 h-8 rounded-xl bg-[#5c4033] text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <GradeBadge grade={store.grade} size="sm" />
                    <span className="font-bold text-[#3d3529] truncate">{store.name}</span>
                  </div>
                  <div className="text-sm text-[#847a6e] font-medium">{store.suburb}</div>
                  <div className="flex gap-3 mt-1 text-xs text-[#847a6e] font-semibold">
                    <span>{FREQUENCY_LABELS[store.frequency]}</span>
                    {store.monthlySpend > 0 && (
                      <span>${store.monthlySpend.toLocaleString()}/mo</span>
                    )}
                    {visit.estimatedArrival && (
                      <span>ETA: {visit.estimatedArrival}</span>
                    )}
                  </div>
                  {store.notes && (
                    <p className="text-xs text-[#8a6240] mt-1 bg-[#f8f2ea] px-2 py-1 rounded-lg font-medium">
                      {store.notes}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
