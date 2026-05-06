/**
 * BlueButton.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The primary action button component used throughout LumiLearn.
 *
 * DESIGN:
 *  Solid blue background with white text. Used for primary/main actions like
 *  "Generate Quiz", "Save Card", "Send", etc.
 *
 * SIZES:
 *  - sm: Small — used in compact spaces (card headers, inline actions)
 *  - md: Medium — the default size for most buttons
 *  - lg: Large — used for prominent CTAs (call-to-action buttons)
 *
 * DISABLED STATE:
 *  When disabled=true, the button becomes semi-transparent and shows a
 *  not-allowed cursor to communicate it's not interactive.
 *
 * PROPS:
 *  children  — Button label/content (text, icons, or JSX)
 *  onClick   — Click handler function
 *  type      — HTML button type: 'button' | 'submit' | 'reset' (default: 'button')
 *  disabled  — Whether the button is non-interactive (default: false)
 *  className — Additional Tailwind classes to merge in
 *  size      — 'sm' | 'md' | 'lg' (default: 'md')
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * BlueButton — Primary action button with configurable size.
 */
export default function BlueButton({ children, onClick, type = 'button', disabled = false, className = '', size = 'md' }) {
  // Size variants: maps size prop to padding + font-size Tailwind classes
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',   // Compact: small padding, small text
    md: 'px-5 py-2.5 text-sm',   // Default: medium padding, small text
    lg: 'px-6 py-3 text-base',   // Large: generous padding, base text size
  };

  return (
    <button
      type={type}           // 'submit' for form buttons, 'button' for standalone actions
      onClick={onClick}     // Click handler (optional — not needed for type="submit")
      disabled={disabled}   // Disables click events and applies disabled styles
      className={`
        ${sizes[size]}
        bg-blue-500 hover:bg-blue-600 text-white font-semibold
        rounded-md border border-blue-600
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${className}
      `}
    >
      {children} {/* Render whatever is passed between the tags */}
    </button>
  );
}
