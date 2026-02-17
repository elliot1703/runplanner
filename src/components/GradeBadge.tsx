import type { Grade } from '../types'
import { GRADE_COLORS } from '../types'

export function GradeBadge({ grade, size = 'md' }: { grade: Grade; size?: 'sm' | 'md' }) {
  const sizeClasses = size === 'sm'
    ? 'w-7 h-7 text-xs rounded-lg'
    : 'w-9 h-9 text-sm rounded-xl'
  return (
    <span
      className={`${GRADE_COLORS[grade]} ${sizeClasses} font-[family-name:var(--font-display)] font-bold inline-flex items-center justify-center shrink-0`}
    >
      {grade}
    </span>
  )
}
