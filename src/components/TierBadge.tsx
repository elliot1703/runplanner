import type { Tier } from '../types'
import { TIER_COLORS } from '../types'

export function TierBadge({ tier, size = 'md' }: { tier: Tier; size?: 'sm' | 'md' }) {
  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-0.5'
  return (
    <span className={`${TIER_COLORS[tier]} ${sizeClasses} rounded font-semibold inline-block`}>
      {tier}
    </span>
  )
}
