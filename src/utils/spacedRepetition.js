// SM-2 Spaced Repetition Algorithm
// quality: 0-5 (0-1 = total blackout, 2 = incorrect but familiar, 3 = correct with difficulty, 4 = correct, 5 = perfect)

export function calculateNextReview(card, quality) {
  let { easeFactor = 2.5, interval = 0, repetitions = 0 } = card;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    repetitions += 1;
    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  } else {
    repetitions = 0;
    interval = 1;
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    ...card,
    easeFactor,
    interval,
    repetitions,
    nextReview: nextReview.toISOString().split('T')[0],
    lastReviewed: new Date().toISOString().split('T')[0],
  };
}

export function isDueToday(card) {
  const today = new Date().toISOString().split('T')[0];
  return !card.nextReview || card.nextReview <= today;
}

export function isDueTomorrow(card) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  return card.nextReview === tomorrowStr;
}

export function isMastered(card) {
  return card.repetitions >= 3 && card.easeFactor >= 2.3;
}
