/**
 * OutlineButton.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The secondary action button component used throughout LumiLearn.
 *
 * DESIGN:
 *  Transparent background with a blue border and blue text.
 *  Used for secondary/alternative actions like "Review Answers", "Export Data",
 *  "Continue Chatting", etc. — actions that are important but not the primary CTA.
 *
 * CONTRAST WITH BlueButton:
 *  - BlueButton: Solid blue — "do the main thing"
 *  - OutlineButton: Outlined blue — "do the secondary thing"
 *
 * SIZES:
 *  - sm: Small — compact spaces
 *  - md: Medium — default
 *  - lg: Large — prominent secondary CTAs
 *
 * PROPS:
 *  children  — Button label/content
 *  onClick   — Click handler
 *  type      — HTML button type (default: 'button')
 *  disabled  — Non-interactive state (default: false)
 *  className — Additional Tailwind classes
 *  size      — 'sm' | 'md' | 'lg' (default: 'md')
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * OutlineButton — Secondary action button with transparent background and blue border.
 */
export default function OutlineButton({ children, onClick, type = 'button', disabled = false, className = '', size = 'md' }) {
  // Size variants: same as BlueButton for consistency
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',   // Compact
    md: 'px-5 py-2.5 text-sm',   // Default
    lg: 'px-6 py-3 text-base',   // Large
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizes[size]}
        bg-transparent hover:bg-blue-50 text-blue-700 font-semibold
        rounded-md border-2 border-blue-400 hover:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
}
