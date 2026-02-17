import { useState } from 'react'
import type { Store, Tier } from '../types'
import { FREQUENCY_LABELS, TIER_BORDER_COLORS, TIER_TEXT_COLORS } from '../types'
import { TierBadge } from './TierBadge'

interface StoreListProps {
  stores: Store[]
  onEdit: (store: Store) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function StoreList({ stores, onEdit, onDelete, onAdd }: StoreListProps) {
  const [filterTier, setFilterTier] = useState<Tier | 'all'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = filterTier === 'all' ? stores : stores.filter(s => s.tier === filterTier)
  const sorted = [...filtered].sort((a, b) => {
    const tierOrder = { A: 0, B: 1, C: 2, D: 3 }
    if (tierOrder[a.tier] !== tierOrder[b.tier]) return tierOrder[a.tier] - tierOrder[b.tier]
    return b.monthlySpend - a.monthlySpend
  })

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">My Stores</h1>
          <span className="text-sm text-gray-500">{stores.length} stores</span>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2">
          {(['all', 'A', 'B', 'C', 'D'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterTier === t
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
            >
              {t === 'all' ? 'All' : `Tier ${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Store list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg mb-1">No stores yet</p>
            <p className="text-sm">Tap + to add your first store</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map(store => (
              <div
                key={store.id}
                className={`bg-white rounded-lg border-l-4 ${TIER_BORDER_COLORS[store.tier]} p-3 shadow-sm active:bg-gray-50`}
                onClick={() => onEdit(store)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <TierBadge tier={store.tier} size="sm" />
                      <span className="font-medium truncate">{store.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{store.suburb}</span>
                      <span>{FREQUENCY_LABELS[store.frequency]}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      {store.monthlySpend > 0 && (
                        <span className={TIER_TEXT_COLORS[store.tier]}>
                          ${store.monthlySpend.toLocaleString()}/mo
                        </span>
                      )}
                      {store.newLinesThisMonth > 0 && (
                        <span className="text-green-600">
                          {store.newLinesThisMonth} new lines
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      if (deleteConfirm === store.id) {
                        onDelete(store.id)
                        setDeleteConfirm(null)
                      } else {
                        setDeleteConfirm(store.id)
                        setTimeout(() => setDeleteConfirm(null), 3000)
                      }
                    }}
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      deleteConfirm === store.id
                        ? 'bg-red-100 text-red-600 font-medium'
                        : 'text-gray-400 active:text-red-500'
                    }`}
                  >
                    {deleteConfirm === store.id ? 'Confirm?' : '✕'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onAdd}
        className="fixed bottom-20 right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg text-2xl flex items-center justify-center active:bg-blue-700 z-10"
      >
        +
      </button>
    </div>
  )
}
