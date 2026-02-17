import type { Store, MonthPlan } from '../types'
import { getSettings } from '../storage'

interface PlanControlsProps {
  stores: Store[]
  plan: MonthPlan | null
  isGenerating: boolean
  onGenerate: () => void
  error: string | null
}

export function PlanControls({ stores, plan, isGenerating, onGenerate, error }: PlanControlsProps) {
  const settings = getSettings()
  const hasApiKey = !!settings.apiKey
  const hasStores = stores.length > 0

  return (
    <div className="px-5 pb-3">
      {error && (
        <div className="bg-[#b5462a]/10 text-[#b5462a] text-sm px-3 py-2 rounded-xl mb-2 font-semibold">
          {error}
        </div>
      )}

      {!hasApiKey && (
        <div className="bg-[#f8f2ea] text-[#8a6240] text-sm px-3 py-2 rounded-xl mb-2 font-semibold">
          Add your Claude API key in Settings to generate plans.
        </div>
      )}

      {!hasStores && (
        <div className="bg-[#f5f2ee] text-[#847a6e] text-sm px-3 py-2 rounded-xl mb-2 font-semibold">
          Add stores first, then generate a plan.
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={isGenerating || !hasApiKey || !hasStores}
        className="w-full bg-[#5c4033] text-white py-3 rounded-xl font-bold text-base disabled:opacity-40 active:bg-[#4a332a] flex items-center justify-center gap-2 transition-colors"
      >
        {isGenerating ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating plan...
          </>
        ) : plan ? (
          'Regenerate Plan'
        ) : (
          'Generate Plan'
        )}
      </button>

      {plan && (
        <p className="text-xs text-[#847a6e] text-center mt-1 font-medium">
          Generated {new Date(plan.generatedAt).toLocaleString()}
        </p>
      )}

      <p className="text-xs text-[#847a6e] text-center mt-1 font-medium">
        Double-tap a day to block/unblock it
      </p>
    </div>
  )
}
