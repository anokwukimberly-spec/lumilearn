/**
 * QuizCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a single quiz question with multiple-choice answer options.
 *
 * STATES:
 *  1. Unanswered: All options show default styling, clickable
 *  2. Selected (not yet checked): Selected option highlighted in blue
 *  3. Answer revealed (showAnswer=true):
 *     - Correct option: Green background + checkmark icon
 *     - Wrong selected option: Red background + X icon
 *     - Other options: Grayed out, non-interactive
 *
 * OPTION LABELS:
 *  Options are labeled A, B, C, D using String.fromCharCode(65 + i):
 *  - 65 is the ASCII code for 'A'
 *  - 65+0='A', 65+1='B', 65+2='C', 65+3='D'
 *
 * PROPS:
 *  question      — The question text string
 *  options       — Array of 4 answer option strings
 *  selectedIndex — Index of the currently selected option (null if none)
 *  onSelect      — Callback(index) when user clicks an option
 *  showAnswer    — Whether to reveal correct/incorrect styling
 *  correctIndex  — Index of the correct answer (used when showAnswer=true)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { FiCheck, FiX } from 'react-icons/fi'; // Check and X icons for answer feedback

/**
 * QuizCard — Multiple-choice question with interactive answer selection.
 */
export default function QuizCard({ question, options, selectedIndex, onSelect, showAnswer = false, correctIndex }) {

  /**
   * getOptionStyle — Returns the appropriate Tailwind classes for an option button
   * based on the current state (unanswered, selected, or answer revealed).
   *
   * @param {number} index - The option's index (0-3)
   * @returns {string} Tailwind class string for border + background + text color
   */
  const getOptionStyle = (index) => {
    if (!showAnswer) {
      // Answer not yet revealed — show selection state only
      return selectedIndex === index
        ? 'border-blue-400 bg-blue-50 text-blue-800'                          // Selected: blue highlight
        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'; // Unselected: hover effect
    }

    // Answer revealed — show correct/incorrect feedback
    if (index === correctIndex) {
      return 'border-green-400 bg-green-50 text-green-800'; // Correct answer: green
    }
    if (index === selectedIndex && index !== correctIndex) {
      return 'border-red-300 bg-red-50 text-red-700'; // Wrong selected answer: red
    }
    return 'border-slate-200 bg-white text-slate-400'; // Other options: grayed out
  };

  return (
    <div>
      {/* Question text */}
      <p className="font-semibold text-slate-800 text-base mb-5 leading-snug">{question}</p>

      {/* Answer options list */}
      <div className="flex flex-col gap-2.5">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => !showAnswer && onSelect(i)} // Only allow selection before answer is revealed
            disabled={showAnswer}                       // Disable all buttons after answer is shown
            className={`text-left w-full px-4 py-3 rounded-lg border-2 text-sm font-medium cursor-pointer disabled:cursor-default flex items-center justify-between gap-3 ${getOptionStyle(i)}`}
          >
            <span>
              {/* Letter label: A, B, C, D — derived from ASCII code */}
              <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + i)}.</span>
              {option}
            </span>

            {/* Feedback icons — only shown when answer is revealed */}
            {showAnswer && i === correctIndex && (
              <FiCheck size={15} className="text-green-600 flex-shrink-0" /> // ✓ for correct
            )}
            {showAnswer && i === selectedIndex && i !== correctIndex && (
              <FiX size={15} className="text-red-500 flex-shrink-0" /> // ✗ for wrong selection
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
