/**
 * Flashcards.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The Flashcards page — the core study tool of LumiLearn.
 *
 * FEATURES:
 *  - Kanban board view: cards sorted into "Due Today", "Coming Up", "Mastered"
 *  - Review mode: full-screen spaced repetition session
 *  - Manual card creation form
 *  - Card deletion
 *
 * SPACED REPETITION:
 *  Cards are scheduled using the SM-2 algorithm (see spacedRepetition.js).
 *  When you rate a card "Easy" it gets a longer interval before next review.
 *  When you rate it "Hard" it resets to a 1-day interval.
 *
 * DATA:
 *  All flashcards are stored in localStorage under the key 'flashcards'.
 *  Each card is a plain object — see the shape in spacedRepetition.js.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateNextReview, isDueToday, isDueTomorrow, isMastered } from '../utils/spacedRepetition';
import { generateId, getTodayStr } from '../utils/helpers';
import PaperCard from '../components/PaperCard';
import BlueButton from '../components/BlueButton';
import FlashcardComponent from '../components/Flashcard';
import { FiLayers, FiPlus, FiX, FiCheckCircle, FiClock, FiPackage } from 'react-icons/fi';

export default function Flashcards() {
  // ── Persistent State ────────────────────────────────────────────────────────
  // flashcards: the full array of card objects, synced to localStorage
  const [flashcards, setFlashcards] = useLocalStorage('flashcards', []);

  // ── Local UI State ──────────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);   // Whether the "Add Card" form is visible
  const [front, setFront] = useState('');             // Front text input value
  const [back, setBack] = useState('');               // Back text input value
  const [deck, setDeck] = useState('General');        // Deck name input value
  const [reviewIdx, setReviewIdx] = useState(0);      // Index of the current card in review mode
  const [mode, setMode] = useState('kanban');         // 'kanban' | 'review' — current view mode

  // ── Derived Data ─────────────────────────────────────────────────────────────
  // These are computed from the flashcards array on every render.
  // No need to store them in state — they're always derived from the source of truth.

  // Cards whose nextReview date is today or in the past (overdue)
  const due = flashcards.filter(isDueToday);

  // Cards due specifically tomorrow (not today, not mastered)
  const tomorrow = flashcards.filter(c => !isDueToday(c) && isDueTomorrow(c));

  // Cards that have been reviewed enough times with high ease factor
  const mastered = flashcards.filter(isMastered);

  // All other cards: not due today, not tomorrow, not mastered
  const other = flashcards.filter(c => !isDueToday(c) && !isDueTomorrow(c) && !isMastered(c));

  // ── Review Handlers ──────────────────────────────────────────────────────────

  /**
   * handleEasy — Called when user rates a card as "Easy" during review.
   * Quality score 5 = perfect recall → longer interval in SM-2 algorithm.
   * Advances to the next card, or ends the session if all cards are done.
   */
  const handleEasy = (card) => {
    // Update this card's SM-2 data with quality=5 (easy/perfect recall)
    setFlashcards(prev => prev.map(c => c.id === card.id ? calculateNextReview(card, 5) : c));

    // Move to the next card, or mark session complete if this was the last one
    if (reviewIdx < due.length - 1) setReviewIdx(prev => prev + 1);
    else setReviewIdx(due.length); // Setting to due.length signals "session complete"
  };

  /**
   * handleHard — Called when user rates a card as "Hard" during review.
   * Quality score 2 = incorrect but familiar → resets interval to 1 day.
   */
  const handleHard = (card) => {
    // Update this card's SM-2 data with quality=2 (hard/incorrect)
    setFlashcards(prev => prev.map(c => c.id === card.id ? calculateNextReview(card, 2) : c));

    // Advance to next card or end session
    if (reviewIdx < due.length - 1) setReviewIdx(prev => prev + 1);
    else setReviewIdx(due.length);
  };

  // ── Card Creation ────────────────────────────────────────────────────────────

  /**
   * handleAddCard — Creates a new flashcard from the form inputs.
   * New cards are scheduled for review starting tomorrow (not today),
   * giving the user time to learn the material before being tested.
   */
  const handleAddCard = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page

    // Don't create a card if either side is empty
    if (!front.trim() || !back.trim()) return;

    // Schedule the first review for tomorrow
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    // Build the new card object with SM-2 default values
    const newCard = {
      id: generateId(),                                          // Unique ID (random + timestamp)
      front: front.trim(),                                       // Question / term
      back: back.trim(),                                         // Answer / definition
      deck: deck.trim() || 'General',                           // Deck name (defaults to 'General')
      easeFactor: 2.5,                                          // SM-2 default ease factor
      interval: 1,                                              // Days until next review
      repetitions: 0,                                           // Number of successful reviews
      nextReview: tomorrowDate.toISOString().split('T')[0],     // ISO date string (YYYY-MM-DD)
      createdAt: getTodayStr(),                                  // Today's date string
    };

    // Append the new card to the existing array
    setFlashcards(prev => [...prev, newCard]);

    // Reset form fields and close the form
    setFront('');
    setBack('');
    setShowForm(false);
  };

  // ── Card Deletion ────────────────────────────────────────────────────────────

  /**
   * handleDelete — Removes a card by its ID from the flashcards array.
   * Uses Array.filter to create a new array without the deleted card.
   */
  const handleDelete = (id) => setFlashcards(prev => prev.filter(c => c.id !== id));

  // ── Kanban Column Component ──────────────────────────────────────────────────

  /**
   * KanbanColumn — A reusable column for the kanban board view.
   * Renders a header with icon + count, then a list of card previews.
   * Shows at most 8 cards to keep the UI clean.
   *
   * @param {string} title - Column header text
   * @param {Component} icon - React icon component
   * @param {string} iconColor - Tailwind text color class for the icon
   * @param {Array} cards - The flashcard objects to display in this column
   * @param {string} emptyMsg - Text shown when the column has no cards
   * @param {string} borderColor - Tailwind border color class for the column header underline
   */
  const KanbanColumn = ({ title, icon: Icon, iconColor, cards, emptyMsg, borderColor }) => (
    <div className="flex flex-col gap-3">
      {/* Column header: icon + title + card count badge */}
      <div className={`flex items-center gap-2 pb-2 border-b-2 ${borderColor}`}>
        <Icon size={14} className={iconColor} />
        <span className="font-bold text-sm text-slate-700">{title}</span>
        {/* Count badge: shows how many cards are in this column */}
        <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">{cards.length}</span>
      </div>

      {/* Empty state or card list */}
      {cards.length === 0 ? (
        <p className="text-xs text-slate-400 py-3 text-center">{emptyMsg}</p>
      ) : (
        // Show up to 8 cards; the rest are hidden with a "+N more" message
        cards.slice(0, 8).map((card, i) => (
          <div
            key={card.id}
            // Slight vertical offset on every 3rd card for a staggered visual effect
            style={{ marginTop: i % 3 === 1 ? '2px' : '0' }}
            className="bg-white border border-slate-200 rounded-lg p-3 group relative"
          >
            {/* Card front text (question/term) */}
            <p className="text-sm font-semibold text-slate-800 mb-1 pr-5">{card.front}</p>
            {/* Card back text (answer) — truncated to 2 lines */}
            <p className="text-xs text-slate-400 line-clamp-2">{card.back}</p>
            {/* Deck label */}
            <span className="text-xs text-blue-400 mt-1 block">{card.deck}</span>
            {/* Delete button — only visible on hover (opacity-0 → group-hover:opacity-100) */}
            <button
              onClick={() => handleDelete(card.id)}
              className="absolute top-2 right-2 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer"
              aria-label="Delete card"
            >
              <FiX size={13} />
            </button>
          </div>
        ))
      )}

      {/* Overflow indicator when more than 8 cards exist */}
      {cards.length > 8 && (
        <p className="text-xs text-slate-400 text-center">+{cards.length - 8} more</p>
      )}
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="max-w-6xl mx-auto px-5 py-7">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-blue-900 mb-1">
              <FiLayers size={22} /> Flashcards
            </h1>
            {/* Summary stats: total cards and how many are due today */}
            <p className="text-sm text-slate-500">
              {flashcards.length} cards total · {due.length} due today
            </p>
          </div>

          {/* Action buttons: "Study Now" (only shown if cards are due) + "New Card" */}
          <div className="flex gap-2 flex-wrap">
            {due.length > 0 && (
              <BlueButton
                size="sm"
                onClick={() => { setMode('review'); setReviewIdx(0); }}
                className="flex items-center gap-1.5"
              >
                Study Now ({due.length})
              </BlueButton>
            )}
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer"
            >
              <FiPlus size={14} /> New Card
            </button>
          </div>
        </div>

        {/* ── Add Card Form ── */}
        {/* Conditionally rendered when showForm is true */}
        {showForm && (
          <PaperCard className="p-5 mb-5" rounded="rounded-xl">
            <p className="font-semibold text-slate-700 mb-4">Add a new flashcard</p>
            <form onSubmit={handleAddCard} className="flex flex-col gap-3">
              {/* Two-column layout for front/back inputs on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Front (question / term)</label>
                  <textarea
                    value={front}
                    onChange={e => setFront(e.target.value)}
                    placeholder="What do you want to remember?"
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Back (answer / definition)</label>
                  <textarea
                    value={back}
                    onChange={e => setBack(e.target.value)}
                    placeholder="The answer..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white resize-none"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Deck name input — groups cards into named collections */}
                <input
                  value={deck}
                  onChange={e => setDeck(e.target.value)}
                  placeholder="Deck name"
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
                />
                <BlueButton type="submit">Save Card</BlueButton>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </PaperCard>
        )}

        {/* ── Review Mode ── */}
        {/* Full-screen spaced repetition session — shown when mode === 'review' */}
        {mode === 'review' && due.length > 0 && (
          <div className="mb-7">
            {/* Review session header: progress counter + exit button */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600">
                Reviewing {Math.min(reviewIdx + 1, due.length)} of {due.length}
              </p>
              <button
                onClick={() => { setMode('kanban'); setReviewIdx(0); }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <FiX size={13} /> Exit Review
              </button>
            </div>

            {/* Show current card OR completion screen */}
            {reviewIdx < due.length ? (
              <div className="max-w-md mx-auto">
                {/* FlashcardComponent handles the flip animation and Easy/Hard buttons */}
                <FlashcardComponent
                  card={due[reviewIdx]}
                  onEasy={handleEasy}
                  onHard={handleHard}
                />
                <p className="text-center text-xs text-slate-400 mt-3">
                  Tap card to reveal · Then rate yourself
                </p>
              </div>
            ) : (
              // All cards reviewed — show completion screen
              <PaperCard className="p-8 text-center max-w-md mx-auto" rounded="rounded-2xl">
                <FiCheckCircle size={48} className="text-green-400 mx-auto mb-3" />
                <p className="font-black text-blue-900 text-xl mb-2">All done!</p>
                <p className="text-sm text-slate-500 mb-4">
                  You reviewed all {due.length} cards.
                </p>
                <BlueButton onClick={() => { setMode('kanban'); setReviewIdx(0); }}>
                  Back to Board
                </BlueButton>
              </PaperCard>
            )}
          </div>
        )}

        {/* ── Kanban Board ── */}
        {/* Three-column board showing cards sorted by their review status */}
        {mode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Column 1: Due Today — cards that need review now */}
            <KanbanColumn
              title="Due Today"
              icon={FiPackage}
              iconColor="text-orange-400"
              cards={due}
              emptyMsg="Nothing due — great job!"
              borderColor="border-orange-300"
            />
            {/* Column 2: Coming Up — cards due tomorrow + future cards */}
            <KanbanColumn
              title="Coming Up"
              icon={FiClock}
              iconColor="text-blue-400"
              cards={[...tomorrow, ...other]} // Merge tomorrow + other future cards
              emptyMsg="No upcoming cards"
              borderColor="border-blue-200"
            />
            {/* Column 3: Mastered — cards reviewed 3+ times with high ease factor */}
            <KanbanColumn
              title="Mastered"
              icon={FiCheckCircle}
              iconColor="text-green-500"
              cards={mastered}
              emptyMsg="Keep reviewing to master cards"
              borderColor="border-green-300"
            />
          </div>
        )}

        {/* ── Empty State ── */}
        {/* Shown when the user has no flashcards at all */}
        {flashcards.length === 0 && (
          <PaperCard className="p-10 text-center mt-5" rounded="rounded-2xl">
            <FiLayers size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium mb-2">No flashcards yet</p>
            <p className="text-sm text-slate-400 mb-4">
              Create cards manually or generate them from a lesson on the Learn page.
            </p>
            <BlueButton
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 mx-auto"
            >
              <FiPlus size={14} /> Create Your First Card
            </BlueButton>
          </PaperCard>
        )}
      </div>
    </div>
  );
}
