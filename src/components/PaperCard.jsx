/**
 * PaperCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A reusable card container with a clean white background and subtle border.
 *
 * DESIGN:
 *  Mimics a physical card or piece of paper — white background, light border,
 *  and a subtle hover lift effect (defined in index.css as .card-hover).
 *
 * USAGE:
 *  Wrap any content in PaperCard to give it the card appearance:
 *  <PaperCard className="p-5">
 *    <p>Content here</p>
 *  </PaperCard>
 *
 * CUSTOMIZATION:
 *  - className: Add padding, margin, or other Tailwind classes
 *  - rounded: Override the border radius (default: 'rounded-xl')
 *    Options: 'rounded-sm', 'rounded-lg', 'rounded-xl', 'rounded-2xl', etc.
 *    Different pages use different radii for visual variety.
 *
 * PROPS:
 *  children  — Content to render inside the card
 *  className — Additional Tailwind classes (typically padding)
 *  rounded   — Tailwind border-radius class (default: 'rounded-xl')
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * PaperCard — White card container with configurable border radius.
 */
export default function PaperCard({ children, className = '', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`
        bg-white border border-slate-200
        ${rounded}
        card-hover
        ${className}
      `}
    >
      {children}
    </div>
  );
}
