/**
 * Footer.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The persistent bottom footer shown on every page.
 *
 * LAYOUT:
 *  - Left side: Brand name + tagline
 *  - Right side: Data privacy note + AI attribution
 *
 * RESPONSIVE:
 *  - Mobile: Stacked vertically (flex-col)
 *  - Desktop: Side by side (sm:flex-row)
 *
 * The footer uses mt-auto in the parent layout (App.jsx) to always stick
 * to the bottom of the page, even on short content pages.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { FiCoffee } from 'react-icons/fi'; // Coffee icon for the tagline

/**
 * Footer — Simple branding footer with privacy and attribution info.
 */
export default function Footer() {
  return (
    // border-t: top border separates footer from page content
    // mt-auto: pushes footer to the bottom when content is short (works with flex-col parent)
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">

        {/* ── Left: Brand ── */}
        <div>
          {/* Brand name — matches the header logo style */}
          <span className="text-xl font-black tracking-tight text-blue-800">LumiLearn</span>

          {/* Tagline — uses Caveat handwriting font for a personal touch */}
          <p className="text-sm text-slate-400 mt-0.5 font-hand text-lg leading-none flex items-center gap-1">
            Made with <FiCoffee size={14} className="inline text-amber-500" /> and procrastination
          </p>
        </div>

        {/* ── Right: Info ── */}
        <div className="flex flex-col sm:items-end gap-1">
          {/* Privacy note: reassures users their data stays local */}
          <p className="text-xs text-slate-400">
            All data stored locally in your browser · No account needed
          </p>
          {/* AI attribution: credits the AI provider and model */}
          <p className="text-xs text-slate-300">
            Powered by OpenRouter · Free AI
          </p>
        </div>
      </div>
    </footer>
  );
}
