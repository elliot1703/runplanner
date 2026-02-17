import type { Store, MonthPlan, Settings } from './types'

const STORES_KEY = 'runplanner_stores'
const PLAN_KEY = 'runplanner_plan'
const SETTINGS_KEY = 'runplanner_settings'

// Stores
export function getStores(): Store[] {
  const data = localStorage.getItem(STORES_KEY)
  return data ? JSON.parse(data) : []
}

export function saveStores(stores: Store[]) {
  localStorage.setItem(STORES_KEY, JSON.stringify(stores))
}

export function addStore(store: Store) {
  const stores = getStores()
  stores.push(store)
  saveStores(stores)
  return stores
}

export function updateStore(updated: Store) {
  const stores = getStores().map(s => s.id === updated.id ? updated : s)
  saveStores(stores)
  return stores
}

export function deleteStore(id: string) {
  const stores = getStores().filter(s => s.id !== id)
  saveStores(stores)
  return stores
}

// Month Plan
export function getPlan(): MonthPlan | null {
  const data = localStorage.getItem(PLAN_KEY)
  return data ? JSON.parse(data) : null
}

export function savePlan(plan: MonthPlan) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan))
}

export function clearPlan() {
  localStorage.removeItem(PLAN_KEY)
}

// Settings
export function getSettings(): Settings {
  const data = localStorage.getItem(SETTINGS_KEY)
  if (data) return JSON.parse(data)
  return {
    homeSuburb: 'North Lakes',
    apiKey: '',
    workDays: [1, 2, 3, 4], // Mon-Thu
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
