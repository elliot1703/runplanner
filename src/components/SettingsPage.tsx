import { useState, useEffect } from 'react'
import type { Settings } from '../types'
import { getSettings, saveSettings } from '../storage'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(getSettings)

  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Settings</h1>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Home Suburb</label>
        <input
          type="text"
          value={settings.homeSuburb}
          onChange={e => setSettings(s => ({ ...s, homeSuburb: e.target.value }))}
          placeholder="e.g. North Lakes"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">Start/end point for daily routes</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Claude API Key</label>
        <input
          type="password"
          value={settings.apiKey}
          onChange={e => setSettings(s => ({ ...s, apiKey: e.target.value }))}
          placeholder="sk-ant-..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <p className="text-xs text-gray-500 mt-1">Used to generate AI route plans. Stored locally only.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Work Days</label>
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
              className={`w-11 h-11 rounded-lg text-sm font-medium transition-colors ${
                settings.workDays.includes(i)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">Days you run store visits</p>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-400">
          RunPlanner MVP — All data stored locally on this device.
        </p>
      </div>
    </div>
  )
}
