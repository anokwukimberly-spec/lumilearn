/**
 * spacedRepetition.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Implementation of the SM-2 (SuperMemo 2) spaced repetition algorithm.
 *
 * WHAT IS SPACED REPETITION?
 * Spaced repetition is a learning technique where you review material at
 * increasing intervals. Instead of cramming, you review a card just before
 * you're about to forget it. This exploits the "spacing effect" — memories
 * are stronger when learning is spread out over time.
 *
 * THE SM-2 ALGORITHM:
 * Developed by Piotr Wozniak in 1987. Each card tracks:
 *  - easeFactor (EF): How easy the card is for you (starts at 2.5, min 1.3)
 *  - interval: Days until the next review
 *  - repetitions: How many times you've successfully recalled it
 *
 * Quality ratings (0-5):
 *  0-1: Complete blackout / wrong
 *  2:   Wrong but the answer felt familiar
 *  3:   Correct with significant difficulty
 *  4:   Correct with some hesitation
 *  5:   Perfect, instant recall
 *
 * In LumiLearn we simplify to two buttons:
 *  - "Easy" = quality 5 (perfect recall)
 *  - "Hard" = quality 2 (incorrect/difficult)
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * calculateNextReview — Applies the SM-2 algorithm to a card and returns
 * an updated card object with new scheduling data.
 *
 * SM-2 INTERVAL SCHEDULE:
 *  - First successful review: interval = 1 day
 *  - Second successful review: interval = 6 days
 *  - Subsequent reviews: interval = round(previous_interval × easeFactor)
 *
 * EASE FACTOR UPDATE FORMULA:
 *  EF' = EF + (0.1 - (5 - q) × (0.08 + (5 - q) × 0.02))
 *  where q is the quality rating (0-5)
 *  EF is clamped to a minimum of 1.3 to prevent intervals from shrinking to 0
 *
 * @param {Object} card - The flashcard object with current SM-2 data
 * @param {number} quality - Rating from 0 (blackout) to 5 (perfect)
 * @returns {Object} New card object with updated easeFactor, interval, repetitions, nextReview
 */
export function calculateNextReview(card, quality) {
  // Destructure SM-2 fields with safe defaults for new cards
  let { easeFactor = 2.5, interval = 0, repetitions = 0 } = card;

  if (quality >= 3) {
    // ── Successful recall (quality 3, 4, or 5) ──────────────────────────────
    // Advance the repetition count and calculate the next interval

    if (repetitions === 0) {
      interval = 1;       // First successful review: review again tomorrow
    } else if (repetitions === 1) {
      interval = 6;       // Second successful review: review in 6 days
    } else {
      // Subsequent reviews: multiply current interval by the ease factor
      // Math.round ensures we get whole-day intervals
      interval = Math.round(interval * easeFactor);
    }

    repetitions += 1; // Increment the successful recall counter

    // Update the ease factor using the SM-2 formula
    // Higher quality → EF increases (card gets easier / longer intervals)
    // Lower quality → EF decreases (card gets harder / shorter intervals)
    easeFactor = Math.max(
      1.3, // Minimum ease factor — prevents intervals from collapsing to 0
      easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
    );
  } else {
    // ── Failed recall (quality 0, 1, or 2) ──────────────────────────────────
    // Reset repetitions and interval — start the learning sequence over
    repetitions = 0;
    interval = 1; // Review again tomorrow
    // Note: easeFactor is NOT changed on failure in standard SM-2
  }

  // Calculate the actual next review date by adding `interval` days to today
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  // Return a new card object (immutable update — don't mutate the original)
  return {
    ...card,                                                    // Spread all existing card fields
    easeFactor,                                                 // Updated ease factor
    interval,                                                   // Updated interval in days
    repetitions,                                                // Updated repetition count
    nextReview: nextReview.toISOString().split('T')[0],         // Next review date as YYYY-MM-DD
    lastReviewed: new Date().toISOString().split('T')[0],       // Today's date as YYYY-MM-DD
  };
}

/**
 * isDueToday — Returns true if a card should be reviewed today or is overdue.
 *
 * A card is due if:
 *  - It has never been reviewed (no nextReview date set)
 *  - Its nextReview date is today or in the past (overdue)
 *
 * String comparison works for ISO dates (YYYY-MM-DD) because they sort
 * lexicographically in the same order as chronologically.
 *
 * @param {Object} card - Flashcard object
 * @returns {boolean} True if the card needs review today
 */
export function isDueToday(card) {
  const today = new Date().toISOString().split('T')[0]; // Today as YYYY-MM-DD
  // !card.nextReview handles new cards that haven't been scheduled yet
  return !card.nextReview || card.nextReview <= today;
}

/**
 * isDueTomorrow — Returns true if a card is scheduled for review tomorrow.
 *
 * Used to populate the "Coming Up" column in the kanban board.
 *
 * @param {Object} card - Flashcard object
 * @returns {boolean} True if the card's nextReview is exactly tomorrow
 */
export function isDueTomorrow(card) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day to today
  const tomorrowStr = tomorrow.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  return card.nextReview === tomorrowStr;
}

/**
 * isMastered — Returns true if a card has been learned well enough to be "mastered".
 *
 * A card is considered mastered when:
 *  - repetitions >= 3: Successfully recalled at least 3 times in a row
 *  - easeFactor >= 2.3: The card is relatively easy (not struggling with it)
 *
 * These thresholds are somewhat arbitrary — they represent a card that has
 * been through the initial learning phase and is now in long-term memory.
 *
 * @param {Object} card - Flashcard object
 * @returns {boolean} True if the card meets the mastery criteria
 */
export function isMastered(card) {
  return card.repetitions >= 3 && card.easeFactor >= 2.3;
}
