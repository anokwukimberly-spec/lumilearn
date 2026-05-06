/**
 * ProgressBar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A horizontal progress bar with optional label and percentage display.
 *
 * USAGE:
 *  <ProgressBar value={3} max={5} label="Question 3 of 5" color="blue" />
 *
 * HOW IT WORKS:
 *  The fill width is calculated as (value / max) * 100, clamped to [0, 100].
 *  The width is applied as an inline style (style={{ width: `${pct}%` }})
 *  because Tailwind can't generate dynamic width classes at runtime.
 *
 * COLORS:
 *  - blue: Default — used for quiz progress
 *  - green: Used for success/completion states
 *  - orange: Used for streak/warning states
 *  - cyan: Used for secondary progress indicators
 *
 * PROPS:
 *  value  — Current progress value (default: 0)
 *  max    — Maximum value (default: 100)
 *  label  — Optional text label shown above the bar
 *  color  — Color variant: 'blue' | 'green' | 'orange' | 'cyan' (default: 'blue')
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * ProgressBar — Horizontal progress indicator with optional label.
 */
export default function ProgressBar({ value = 0, max = 100, label = '', color = 'blue' }) {
  // Calculate percentage, clamped to [0, 100] to prevent overflow
  // Math.max(0, ...) prevents negative values
  // Math.min(100, ...) prevents values over 100%
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  // Color variants: maps color prop to Tailwind background color class
  const colors = {
    blue:   'bg-blue-500',
    green:  'bg-green-500',
    orange: 'bg-orange-400',
    cyan:   'bg-cyan-500',
  };

  return (
    <div className="w-full">
      {/* Optional label row: shows label text on left, percentage on right */}
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500">{label}</span>
          <span className="text-xs font-semibold text-slate-600">{Math.round(pct)}%</span>
        </div>
      )}

      {/* Track: the full-width gray background bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 border border-slate-200">
        {/* Fill: the colored portion that represents progress */}
        {/* Width is set via inline style because Tailwind can't generate dynamic classes */}
        <div
          className={`h-2 rounded-full ${colors[color] || colors.blue}`}
          style={{ width: `${pct}%` }} // Dynamic width based on progress percentage
        />
      </div>
    </div>
  );
}
