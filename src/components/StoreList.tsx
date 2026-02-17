import { useState } from 'react'
import type { Store, Grade } from '../types'
import { FREQUENCY_LABELS, GRADE_TEXT_COLORS } from '../types'
import { GradeBadge } from './GradeBadge'

interface StoreListProps {
  stores: Store[]
  onEdit: (store: Store) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function StoreList({ stores, onEdit, onDelete, onAdd }: StoreListProps) {
  const [filterGrade, setFilterGrade] = useState<Grade | 'all'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = filterGrade === 'all' ? stores : stores.filter(s => s.grade === filterGrade)
  const sorted = [...filtered].sort((a, b) => {
    const gradeOrder = { A: 0, B: 1, C: 2 }
    if (gradeOrder[a.grade] !== gradeOrder[b.grade]) return gradeOrder[a.grade] - gradeOrder[b.grade]
    return b.monthlySpend - a.monthlySpend
  })

  return (
    <div className="flex flex-col h-full bg-[#faf9f6]">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#3d3529]">My Stores</h1>
          <span className="text-sm text-[#847a6e] font-semibold">{stores.length} stores</span>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2">
          {(['all', 'A', 'B', 'C'] as const).map(g => (
            <button
              key={g}
              onClick={() => setFilterGrade(g)}
              className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${
                filterGrade === g
                  ? 'bg-[#5c4033] text-white'
                  : 'bg-white text-[#847a6e] border border-[#e8e2d8] active:bg-[#f5f2ee]'
              }`}
            >
              {g === 'all' ? 'All' : `Grade ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* Store list */}
      <div className="flex-1 overflow-y-auto px-5 pb-24">
        {sorted.length === 0 ? (
          <div className="text-center py-12 text-[#847a6e]">
            <p className="text-lg mb-1 font-semibold">No stores yet</p>
            <p className="text-sm">Tap + to add your first store</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map(store => (
              <div
                key={store.id}
                className="bg-white rounded-2xl border border-[#e8e2d8] p-4 flex items-start gap-3.5 active:bg-[#faf9f6] transition-all cursor-pointer hover:border-[#d4cdc4] hover:shadow-sm"
                onClick={() => onEdit(store)}
              >
                <GradeBadge grade={store.grade} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[15px] text-[#3d3529] truncate">{store.name}</div>
                  <div className="text-xs text-[#847a6e] mt-0.5 font-medium">
                    {store.suburb} &middot; {FREQUENCY_LABELS[store.frequency]}
                  </div>
                  <div className="flex items-center gap-3.5 mt-1.5 text-xs font-bold">
                    {store.monthlySpend > 0 && (
                      <span className={GRADE_TEXT_COLORS[store.grade]}>
                        ${store.monthlySpend.toLocaleString()}/mo
                      </span>
                    )}
                    {store.newLinesThisMonth > 0 ? (
                      <span className="text-[#527a3a]">
                        {store.newLinesThisMonth} new line{store.newLinesThisMonth !== 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="text-[#b5462a]">0 new lines</span>
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
                  className={`ml-1 px-2 py-1 rounded-lg text-sm transition-colors ${
                    deleteConfirm === store.id
                      ? 'bg-[#b5462a]/10 text-[#b5462a] font-bold'
                      : 'text-[#847a6e] active:text-[#b5462a]'
                  }`}
                >
                  {deleteConfirm === store.id ? 'Confirm?' : '\u2715'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onAdd}
        className="fixed bottom-20 right-4 w-14 h-14 bg-[#5c4033] text-white rounded-2xl shadow-lg text-2xl flex items-center justify-center active:bg-[#4a332a] z-10 transition-colors"
      >
        +
      </button>
    </div>
  )
}
