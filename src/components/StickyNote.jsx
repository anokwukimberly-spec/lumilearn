/**
 * StickyNote.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A container styled to look like a physical sticky note.
 *
 * DESIGN:
 *  Amber/yellow background with a slight rotation to mimic a real sticky note
 *  placed at an angle. Used for supplementary information, tips, and the
 *  "Generate Flashcards" prompt on the Learn page.
 *
 * ROTATION:
 *  The rotate prop controls the CSS rotation:
 *  - '-1': Slight counter-clockwise tilt (default)
 *  - '1': Slight clockwise tilt
 *  - '0': No rotation (flat)
 *
 *  These map to CSS classes defined in index.css:
 *  - .rotate-neg-one { transform: rotate(-1deg); }
 *  - .rotate-one { transform: rotate(1deg); }
 *
 * PROPS:
 *  children  — Content to render inside the sticky note
 *  className — Additional Tailwind classes (typically padding)
 *  rotate    — Rotation direction: '-1' | '1' | '0' (default: '-1')
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * StickyNote — Amber-colored container with a slight rotation for a sticky note effect.
 */
export default function StickyNote({ children, className = '', rotate = '-1' }) {
  // Map the rotate prop to the corresponding CSS class
  const rotations = {
    '-1': 'rotate-neg-one', // Slight counter-clockwise tilt
    '1':  'rotate-one',     // Slight clockwise tilt
    '0':  '',               // No rotation
  };

  return (
    <div
      className={`
        bg-amber-50 border border-amber-200
        p-4 rounded-sm
        ${rotations[rotate] || 'rotate-neg-one'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
