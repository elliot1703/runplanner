import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Store, Grade, Frequency } from '../types'

interface StoreFormProps {
  store?: Store | null
  onSave: (store: Store) => void
  onCancel: () => void
}

const GRADES: { value: Grade; label: string }[] = [
  { value: 'A', label: 'Grade A' },
  { value: 'B', label: 'Grade B' },
  { value: 'C', label: 'Grade C' },
]

export function StoreForm({ store, onSave, onCancel }: StoreFormProps) {
  const [name, setName] = useState('')
  const [suburb, setSuburb] = useState('')
  const [address, setAddress] = useState('')
  const [grade, setGrade] = useState<Grade>('B')
  const [frequency, setFrequency] = useState<Frequency>('weekly')
  const [monthlySpend, setMonthlySpend] = useState(0)
  const [newLines, setNewLines] = useState(0)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (store) {
      setName(store.name)
      setSuburb(store.suburb)
      setAddress(store.address || '')
      setGrade(store.grade)
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
      grade,
      frequency,
      monthlySpend,
      newLinesThisMonth: newLines,
      notes: notes.trim() || undefined,
      rescheduledCount: store?.rescheduledCount || 0,
      lat: store?.lat,
      lng: store?.lng,
    })
  }

  const inputClasses = 'w-full border border-[#e8e2d8] bg-white rounded-xl px-3 py-2.5 text-base text-[#3d3529] focus:ring-2 focus:ring-[#5c4033]/30 focus:border-[#5c4033] outline-none transition-colors'
  const labelClasses = 'block text-sm font-semibold text-[#3d3529] mb-1'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-[#faf9f6] min-h-full">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#3d3529]">
        {store ? 'Edit Store' : 'Add Store'}
      </h2>

      <div>
        <label className={labelClasses}>Store Name *</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="e.g. IGA Mooloolaba"
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Suburb *</label>
        <input
          type="text"
          value={suburb}
          onChange={e => setSuburb(e.target.value)}
          required
          placeholder="e.g. Mooloolaba"
          className={inputClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Address</label>
        <input
          type="text"
          value={address}
          onChange={e => setAddress(e.target.value)}
          placeholder="Full street address (optional)"
          className={inputClasses}
        />
      </div>

      {/* Grade segmented control */}
      <div>
        <label className={labelClasses}>Grade *</label>
        <div className="flex gap-0 border border-[#e8e2d8] rounded-xl overflow-hidden">
          {GRADES.map(g => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGrade(g.value)}
              className={`flex-1 py-3 text-sm font-extrabold transition-all border-r border-[#e8e2d8] last:border-r-0 ${
                grade === g.value
                  ? g.value === 'A' ? 'bg-[#5c4033] text-white'
                    : g.value === 'B' ? 'bg-[#8a6240] text-white'
                    : 'bg-[#6b6560] text-white'
                  : 'bg-white text-[#847a6e] hover:bg-[#f5f2ee]'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Frequency *</label>
        <select
          value={frequency}
          onChange={e => setFrequency(e.target.value as Frequency)}
          className={`${inputClasses} bg-white`}
        >
          <option value="twice-weekly">Twice Weekly</option>
          <option value="weekly">Weekly</option>
          <option value="fortnightly">Fortnightly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Monthly Spend ($)</label>
          <input
            type="number"
            value={monthlySpend || ''}
            onChange={e => setMonthlySpend(Number(e.target.value))}
            min={0}
            placeholder="0"
            className={inputClasses}
          />
        </div>
        <div>
          <label className={labelClasses}>New Lines</label>
          <input
            type="number"
            value={newLines || ''}
            onChange={e => setNewLines(Number(e.target.value))}
            min={0}
            placeholder="0"
            className={inputClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          placeholder="Special instructions, delivery notes, etc."
          className={`${inputClasses} resize-none`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={!name.trim() || !suburb.trim()}
          className="flex-1 bg-[#5c4033] text-white py-3 rounded-xl font-bold text-base disabled:opacity-40 active:bg-[#4a332a] transition-colors"
        >
          {store ? 'Save Changes' : 'Add Store'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-[#e8e2d8] rounded-xl text-base text-[#847a6e] font-semibold active:bg-[#f5f2ee] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
