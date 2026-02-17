import { useState, useCallback } from 'react'
import './App.css'
import type { Store, MonthPlan, DayPlan } from './types'
import { getStores, saveStores, addStore, updateStore, deleteStore, getPlan, savePlan, getSettings } from './storage'
import { StoreList } from './components/StoreList'
import { StoreForm } from './components/StoreForm'
import { MonthCalendar } from './components/MonthCalendar'
import { DayRunSheet } from './components/DayRunSheet'
import { PlanControls } from './components/PlanControls'
import { SettingsPage } from './components/SettingsPage'

type Tab = 'stores' | 'plan' | 'settings'

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
    <div className="h-screen flex flex-col max-w-lg mx-auto">
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

      {/* Bottom tabs */}
      <nav className="border-t border-gray-200 bg-white flex safe-bottom">
        {([
          { id: 'stores' as Tab, label: 'My Stores', icon: '🏪' },
          { id: 'plan' as Tab, label: 'Plan', icon: '📅' },
          { id: 'settings' as Tab, label: 'Settings', icon: '⚙️' },
        ]).map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setShowStoreForm(false) }}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 ${
              tab === t.id ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{t.icon}</span>
            <span className="text-xs font-medium">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
