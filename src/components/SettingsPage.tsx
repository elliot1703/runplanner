import { useState, useEffect } from 'react'
import type { Settings } from '../types'
import { getSettings, saveSettings } from '../storage'
import { SuburbAutocomplete } from './SuburbAutocomplete'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(getSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  const inputClasses = 'w-full border border-[#e8e2d8] bg-white rounded-xl px-3 py-2.5 text-base text-[#3d3529] focus:ring-2 focus:ring-[#5c4033]/30 focus:border-[#5c4033] outline-none transition-colors'
  const labelClasses = 'block text-sm font-semibold text-[#3d3529] mb-1'

  return (
    <div className="p-5 space-y-6 bg-[#faf9f6] min-h-full">
      <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#3d3529]">Settings</h1>

      <div>
        <label className={labelClasses}>Home Suburb</label>
        <SuburbAutocomplete
          value={settings.homeSuburb}
          onChange={v => setSettings(s => ({ ...s, homeSuburb: v }))}
          placeholder="e.g. North Lakes"
        />
        <p className="text-xs text-[#847a6e] mt-1 font-medium">Start/end point for daily routes</p>
      </div>

      <div>
        <label className={labelClasses}>Claude API Key</label>
        <input
          type="password"
          value={settings.apiKey}
          onChange={e => setSettings(s => ({ ...s, apiKey: e.target.value }))}
          placeholder="sk-ant-..."
          className={`${inputClasses} font-mono`}
        />
        <p className="text-xs text-[#847a6e] mt-1 font-medium">Used to generate AI route plans. Stored locally only.</p>
      </div>

      <div>
        <label className={`${labelClasses} mb-2`}>Work Days</label>
        <div className="flex gap-2">
          {DAY_NAMES.map((name, i) => (
            <button
              key={i}
              onClick={() =>
                setSettings(s => ({
                  ...s,
                  workDays: s.workDays.includes(i)
                    ? s.workDays.filter(d => d !== i)
                    : [...s.workDays, i].sort(),
                }))
              }
              className={`w-11 h-11 rounded-xl text-sm font-bold transition-all ${
                settings.workDays.includes(i)
                  ? 'bg-[#5c4033] text-white'
                  : 'bg-white text-[#847a6e] border border-[#e8e2d8]'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#847a6e] mt-1 font-medium">Days you run store visits</p>
      </div>

      <div className="pt-4 border-t border-[#e8e2d8]">
        <p className="text-xs text-[#847a6e] font-medium">
          RunPlanner MVP &mdash; All data stored locally on this device.
        </p>
      </div>
    </div>
  )
}
