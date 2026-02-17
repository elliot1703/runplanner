import { useState, useCallback } from 'react'
import './App.css'
import type { Store, MonthPlan, DayPlan } from './types'
import { getStores, addStore, updateStore, deleteStore, getPlan, savePlan, getSettings } from './storage'
import { StoreList } from './components/StoreList'
import { StoreForm } from './components/StoreForm'
import { MonthCalendar } from './components/MonthCalendar'
import { DayRunSheet } from './components/DayRunSheet'
import { PlanControls } from './components/PlanControls'
import { SettingsPage } from './components/SettingsPage'

type Tab = 'stores' | 'plan' | 'settings'

// SVG nav icons
function StoresIcon({ active }: { active: boolean }) {
  const color = active ? '#5c4033' : '#847a6e'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function PlanIcon({ active }: { active: boolean }) {
  const color = active ? '#5c4033' : '#847a6e'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function SettingsIcon({ active }: { active: boolean }) {
  const color = active ? '#5c4033' : '#847a6e'
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

const NAV_ITEMS: { id: Tab; label: string; Icon: typeof StoresIcon }[] = [
  { id: 'stores', label: 'Stores', Icon: StoresIcon },
  { id: 'plan', label: 'Plan', Icon: PlanIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsIcon },
]

function App() {
  const [tab, setTab] = useState<Tab>('plan')
  const [stores, setStores] = useState<Store[]>(getStores)
  const [plan, setPlan] = useState<MonthPlan | null>(getPlan)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [showStoreForm, setShowStoreForm] = useState(false)
  const [selectedDay, setSelectedDay] = useState<{ date: string; dayPlan: DayPlan } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Store CRUD
  const handleSaveStore = useCallback((store: Store) => {
    const existing = stores.find(s => s.id === store.id)
    const updated = existing ? updateStore(store) : addStore(store)
    setStores(updated)
    setShowStoreForm(false)
    setEditingStore(null)
  }, [stores])

  const handleDeleteStore = useCallback((id: string) => {
    setStores(deleteStore(id))
  }, [])

  // Plan generation
  const handleGenerate = useCallback(async () => {
    const settings = getSettings()
    if (!settings.apiKey) {
      setError('Add your Claude API key in Settings first.')
      return
    }
    if (stores.length === 0) {
      setError('Add some stores first.')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stores,
          homeSuburb: settings.homeSuburb,
          workDays: settings.workDays,
          blockedDays: plan?.blockedDays || [],
          month: currentDate.getMonth(),
          year: currentDate.getFullYear(),
          apiKey: settings.apiKey,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Server error' }))
        throw new Error(data.error || `HTTP ${res.status}`)
      }

      const newPlan: MonthPlan = await res.json()
      savePlan(newPlan)
      setPlan(newPlan)
    } catch (err: any) {
      setError(err.message || 'Failed to generate plan')
    } finally {
      setIsGenerating(false)
    }
  }, [stores, plan, currentDate])

  // Block/unblock days
  const handleToggleBlock = useCallback((dateStr: string) => {
    if (!plan) return
    const blocked = plan.blockedDays.includes(dateStr)
    const updatedPlan = {
      ...plan,
      blockedDays: blocked
        ? plan.blockedDays.filter(d => d !== dateStr)
        : [...plan.blockedDays, dateStr],
      days: plan.days.map(d =>
        d.date === dateStr ? { ...d, isBlocked: !blocked } : d
      ),
    }
    savePlan(updatedPlan)
    setPlan(updatedPlan)
  }, [plan])

  const handleDayClick = useCallback((date: string, dayPlan?: DayPlan) => {
    if (dayPlan && dayPlan.stores.length > 0) {
      setSelectedDay({ date, dayPlan })
    }
  }, [])

  return (
    <div className="h-screen flex flex-col max-w-lg mx-auto bg-[#faf9f6]">
      {/* Content area */}
      <div className="flex-1 overflow-hidden">
        {tab === 'stores' && !showStoreForm && (
          <StoreList
            stores={stores}
            onEdit={s => { setEditingStore(s); setShowStoreForm(true) }}
            onDelete={handleDeleteStore}
            onAdd={() => { setEditingStore(null); setShowStoreForm(true) }}
          />
        )}

        {tab === 'stores' && showStoreForm && (
          <StoreForm
            store={editingStore}
            onSave={handleSaveStore}
            onCancel={() => { setShowStoreForm(false); setEditingStore(null) }}
          />
        )}

        {tab === 'plan' && (
          <div className="flex flex-col h-full">
            <PlanControls
              stores={stores}
              plan={plan}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              error={error}
            />
            <div className="flex-1 overflow-hidden">
              <MonthCalendar
                currentDate={currentDate}
                onDateChange={setCurrentDate}
                plan={plan}
                stores={stores}
                onDayClick={handleDayClick}
                onToggleBlock={handleToggleBlock}
              />
            </div>
          </div>
        )}

        {tab === 'settings' && <SettingsPage />}
      </div>

      {/* Day Run Sheet */}
      {selectedDay && (
        <DayRunSheet
          date={selectedDay.date}
          dayPlan={selectedDay.dayPlan}
          stores={stores}
          onClose={() => setSelectedDay(null)}
        />
      )}

      {/* Bottom tabs — SVG icons */}
      <nav className="border-t border-[#e8e2d8] bg-white flex safe-bottom">
        {NAV_ITEMS.map(t => {
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setShowStoreForm(false) }}
              className={`flex-1 py-3 flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-[#5c4033]' : 'text-[#847a6e]'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                isActive ? 'bg-[#f5eeea]' : ''
              }`}>
                <t.Icon active={isActive} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide">{t.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

export default App
