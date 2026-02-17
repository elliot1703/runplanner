import { useState, useRef, useEffect } from 'react'
import { SUBURBS } from '../suburbs'

interface SuburbAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

export function SuburbAutocomplete({ value, onChange, placeholder = 'e.g. Mooloolaba', required }: SuburbAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filtered, setFiltered] = useState<string[]>([])
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value.length >= 2) {
      const lower = value.toLowerCase()
      const matches = SUBURBS.filter(s => s.toLowerCase().includes(lower)).slice(0, 8)
      setFiltered(matches)
      setIsOpen(matches.length > 0)
    } else {
      setFiltered([])
      setIsOpen(false)
    }
  }, [value])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function selectSuburb(suburb: string) {
    onChange(suburb)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => { if (filtered.length > 0) setIsOpen(true) }}
        required={required}
        placeholder={placeholder}
        className="w-full border border-[#e8e2d8] bg-white rounded-xl px-3 py-2.5 text-base text-[#3d3529] focus:ring-2 focus:ring-[#5c4033]/30 focus:border-[#5c4033] outline-none transition-colors"
        autoComplete="off"
      />
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-[#e8e2d8] rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
          {filtered.map(suburb => (
            <button
              key={suburb}
              type="button"
              onClick={() => selectSuburb(suburb)}
              className="w-full text-left px-3 py-2.5 text-sm text-[#3d3529] hover:bg-[#f5eeea] active:bg-[#f5eeea] font-medium transition-colors border-b border-[#e8e2d8] last:border-b-0"
            >
              {suburb}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
