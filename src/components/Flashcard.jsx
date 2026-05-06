/**
 * Flashcard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * An interactive flashcard with a 3D flip animation.
 *
 * HOW THE FLIP ANIMATION WORKS:
 *  CSS 3D transforms are used to simulate a physical card flip:
 *  1. The outer container has `perspective: 800px` — this creates the 3D space
 *  2. The inner div has `transform-style: preserve-3d` — children exist in 3D
 *  3. The front face is at rotateY(0deg) — facing the viewer
 *  4. The back face is at rotateY(180deg) — facing away from the viewer
 *  5. Both faces have `backface-visibility: hidden` — you can't see through them
 *  6. When flipped, the inner div rotates to rotateY(180deg):
 *     - Front rotates away (now at 180deg, hidden by backface-visibility)
 *     - Back rotates into view (now at 360deg = 0deg, visible)
 *
 * PROPS:
 *  card        — Flashcard object { front, back, deck, ... }
 *  onEasy      — Callback when user rates the card "Easy" (quality 5)
 *  onHard      — Callback when user rates the card "Hard" (quality 2)
 *  showActions — Whether to show Easy/Hard buttons (default: true)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { FiThumbsUp, FiThumbsDown, FiRotateCcw } from 'react-icons/fi';

/**
 * FlashcardComponent — Interactive card with flip animation and rating buttons.
 */
export default function FlashcardComponent({ card, onEasy, onHard, showActions = true }) {
  // flipped: tracks whether the card is showing the front (false) or back (true)
  const [flipped, setFlipped] = useState(false);

  /**
   * handleFlip — Toggles the card between front and back.
   * Called when the user clicks anywhere on the card.
   */
  const handleFlip = () => setFlipped(!flipped);

  /**
   * handleEasy — Handles the "Easy" button click.
   * e.stopPropagation() prevents the click from bubbling up to the card,
   * which would trigger handleFlip and flip the card back immediately.
   * We reset the flip state first, then call the parent callback after a
   * short delay so the user sees the card flip back before it advances.
   */
  const handleEasy = (e) => {
    e.stopPropagation(); // Don't trigger the card flip
    setFlipped(false);   // Flip card back to front
    setTimeout(() => onEasy && onEasy(card), 100); // Advance after brief delay
  };

  /**
   * handleHard — Handles the "Hard" button click.
   * Same pattern as handleEasy but calls onHard callback.
   */
  const handleHard = (e) => {
    e.stopPropagation(); // Don't trigger the card flip
    setFlipped(false);   // Flip card back to front
    setTimeout(() => onHard && onHard(card), 100); // Advance after brief delay
  };

  return (
    // Outer container: sets the 3D perspective for the flip animation
    // height: 180px is fixed so the card doesn't resize when flipping
    <div className="flashcard-scene w-full" style={{ height: '180px' }}>

      {/* Inner container: this is what actually rotates */}
      <div
        style={{
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', // Flip state
          transition: 'transform 0.45s',                              // Smooth 450ms animation
          transformStyle: 'preserve-3d',                              // Enable 3D for children
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
        onClick={handleFlip}   // Click anywhere on the card to flip it
        className="cursor-pointer"
      >

        {/* ── Front Face ── */}
        {/* Shows the question/term. backfaceVisibility: hidden hides it when flipped. */}
        <div
          className="absolute w-full h-full bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }} // Hidden when rotated 180deg
        >
          {/* Card front text — centered vertically and horizontally */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center font-semibold text-slate-800 text-base leading-snug">
              {card.front}
            </p>
          </div>

          {/* Footer: deck name on left, "tap to flip" hint on right */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400 font-hand text-base">
              {card.deck || 'General'}
            </span>
            <span className="flex items-center gap-1 text-xs text-blue-400">
              <FiRotateCcw size={11} /> tap to flip
            </span>
          </div>
        </div>

        {/* ── Back Face ── */}
        {/* Shows the answer/definition. Pre-rotated 180deg so it faces away initially. */}
        <div
          className="absolute w-full h-full bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col justify-between"
          style={{
            backfaceVisibility: 'hidden',    // Hidden when at 0deg (front-facing)
            transform: 'rotateY(180deg)',    // Pre-rotated so it faces away initially
          }}
        >
          {/* Card back text — centered vertically and horizontally */}
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-slate-700 text-sm leading-relaxed">
              {card.back}
            </p>
          </div>

          {/* Easy/Hard rating buttons — only shown when showActions is true */}
          {showActions && (
            <div className="flex gap-2 mt-2">
              {/* Hard button: red styling, quality 2 in SM-2 */}
              <button
                onClick={handleHard}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-red-50 border border-red-200 text-red-600 rounded-md hover:bg-red-100 cursor-pointer"
              >
                <FiThumbsDown size={12} /> Hard
              </button>

              {/* Easy button: green styling, quality 5 in SM-2 */}
              <button
                onClick={handleEasy}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-green-50 border border-green-200 text-green-700 rounded-md hover:bg-green-100 cursor-pointer"
              >
                <FiThumbsUp size={12} /> Easy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
