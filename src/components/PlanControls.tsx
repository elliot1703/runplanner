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
    <div className="px-4 pb-3">
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg mb-2">
          {error}
        </div>
      )}

      {!hasApiKey && (
        <div className="bg-amber-50 text-amber-700 text-sm px-3 py-2 rounded-lg mb-2">
          Add your Claude API key in Settings to generate plans.
        </div>
      )}

      {!hasStores && (
        <div className="bg-gray-50 text-gray-500 text-sm px-3 py-2 rounded-lg mb-2">
          Add stores first, then generate a plan.
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={isGenerating || !hasApiKey || !hasStores}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium text-base disabled:opacity-40 active:bg-blue-700 flex items-center justify-center gap-2"
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
        <p className="text-xs text-gray-400 text-center mt-1">
          Generated {new Date(plan.generatedAt).toLocaleString()}
        </p>
      )}

      <p className="text-xs text-gray-400 text-center mt-1">
        Double-tap a day to block/unblock it
      </p>
    </div>
  )
}
