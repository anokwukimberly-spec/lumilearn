/**
 * StreakDisplay.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays the user's daily learning streak with a visual stamp card.
 *
 * DESIGN:
 *  - Fire icon + streak count (large or medium depending on size prop)
 *  - "Stamp card": A row of 10 circles, filled for completed days
 *  - Total study time (if > 0)
 *
 * THE STAMP CARD:
 *  Shows up to 10 circles. Circles up to `count` are filled (orange),
 *  the rest are empty (gray). This gives a visual sense of progress
 *  similar to a coffee shop loyalty card.
 *
 *  Array.from({ length: Math.max(10, count) }, (_, i) => i < count)
 *  Creates an array of booleans: [true, true, false, false, ...]
 *  where true = completed day, false = future day.
 *  Math.max(10, count) ensures we always show at least 10 circles.
 *
 * SIZES:
 *  - 'md': Medium — used on the Landing Page and smaller cards
 *  - 'lg': Large — used on the Dashboard's main streak card
 *
 * PROPS:
 *  count        — Current streak count (number of consecutive days)
 *  totalMinutes — Total study time in minutes
 *  size         — 'md' | 'lg' (default: 'md')
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { FiZap, FiCircle } from 'react-icons/fi'; // Zap for active days, Circle for empty days
import { RiFireFill } from 'react-icons/ri';       // Fire icon for the streak display

/**
 * StreakDisplay — Visual streak counter with stamp card and study time.
 */
export default function StreakDisplay({ count = 0, totalMinutes = 0, size = 'md' }) {
  // Create an array of booleans representing each day in the stamp card
  // true = day completed (filled stamp), false = day not yet reached (empty)
  // We show at least 10 circles, or more if the streak exceeds 10
  const stamps = Array.from({ length: Math.max(10, count) }, (_, i) => i < count);

  return (
    <div>
      {/* ── Streak Counter ── */}
      {/* Two size variants: large for dashboard, medium for other cards */}
      {size === 'lg' ? (
        // Large variant: bigger fire icon and larger text
        <div className="flex items-center gap-3 mb-3">
          <RiFireFill size={36} className="text-orange-500" />
          <div>
            <p className="text-3xl font-black text-orange-600">{count}</p>
            <p className="text-sm text-slate-500 font-medium">day streak</p>
          </div>
        </div>
      ) : (
        // Medium variant: smaller fire icon and text
        <div className="flex items-center gap-2 mb-2">
          <RiFireFill size={24} className="text-orange-500" />
          <div>
            <span className="text-xl font-black text-orange-600">{count}</span>
            <span className="text-sm text-slate-500 ml-1">day streak</span>
          </div>
        </div>
      )}

      {/* ── Stamp Card ── */}
      {/* Shows up to 10 circles; filled circles = completed days */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {stamps.slice(0, 10).map((active, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center
              ${active
                ? 'border-orange-400 bg-orange-100 text-orange-500' // Completed day: orange fill
                : 'border-slate-200 bg-slate-50 text-slate-300'     // Future day: gray empty
              }`}
          >
            {active
              ? <FiZap size={12} className="fill-orange-400 text-orange-500" /> // Lightning bolt for active days
              : <FiCircle size={10} />                                           // Empty circle for future days
            }
          </div>
        ))}
      </div>

      {/* ── Total Study Time ── */}
      {/* Only shown if the user has logged any study time */}
      {totalMinutes > 0 && (
        <p className="text-xs text-slate-400 mt-2">
          {/* Convert total minutes to hours + minutes format */}
          {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m total study time
        </p>
      )}
    </div>
  );
}
