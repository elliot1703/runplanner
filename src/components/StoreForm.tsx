import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Store, Tier, Frequency } from '../types'

interface StoreFormProps {
  store?: Store | null
  onSave: (store: Store) => void
  onCancel: () => void
}

export function StoreForm({ store, onSave, onCancel }: StoreFormProps) {
  const [name, setName] = useState('')
  const [suburb, setSuburb] = useState('')
  const [address, setAddress] = useState('')
  const [tier, setTier] = useState<Tier>('B')
  const [frequency, setFrequency] = useState<Frequency>('weekly')
  const [monthlySpend, setMonthlySpend] = useState(0)
  const [newLines, setNewLines] = useState(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (store) {
      setName(store.name)
      setSuburb(store.suburb)
      setAddress(store.address || '')
      setTier(store.tier)
      setFrequency(store.frequency)
      setMonthlySpend(store.monthlySpend)
      setNewLines(store.newLinesThisMonth)
      setNotes(store.notes || '')
    }
  }, [store])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      id: store?.id || uuidv4(),
      name: name.trim(),
      suburb: suburb.trim(),
      address: address.trim() || undefined,
      tier,
      frequency,
      monthlySpend,
      newLinesThisMonth: newLines,
      notes: notes.trim() || undefined,
      rescheduledCount: store?.rescheduledCount || 0,
      lat: store?.lat,
      lng: store?.lng,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">{store ? 'Edit Store' : 'Add Store'}</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Store Name *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="e.g. IGA Mooloolaba"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Suburb *</label>
        <input
          type="text"
          value={suburb}
          onChange={e => setSuburb(e.target.value)}
          required
          placeholder="e.g. Mooloolaba"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Full street address (optional)"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tier *</label>
          <select
            value={tier}
            onChange={e => setTier(e.target.value as Tier)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="A">A - Highest Priority</option>
            <option value="B">B - High Priority</option>
            <option value="C">C - Medium Priority</option>
            <option value="D">D - Flexible</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
          <select
            value={frequency}
            onChange={e => setFrequency(e.target.value as Frequency)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="twice-weekly">Twice Weekly</option>
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Spend ($)</label>
          <input
            type="number"
            value={monthlySpend || ''}
            onChange={e => setMonthlySpend(Number(e.target.value))}
            min={0}
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Lines</label>
          <input
            type="number"
            value={newLines || ''}
            onChange={e => setNewLines(Number(e.target.value))}
            min={0}
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          placeholder="Special instructions, delivery notes, etc."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!name.trim() || !suburb.trim()}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium text-base disabled:opacity-40 active:bg-blue-700"
        >
          {store ? 'Save Changes' : 'Add Store'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-gray-300 rounded-lg text-base text-gray-600 active:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
