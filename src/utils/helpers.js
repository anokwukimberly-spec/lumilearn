/**
 * helpers.js
 * ─────────────────────────────────────────────────────────────────────────────
 * General-purpose utility functions used across the entire app.
 * These are pure functions (no side effects) except for exportAllData and
 * initLocalStorage which interact with browser APIs.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * generateId — Creates a unique string ID for new records (cards, quizzes, etc.)
 *
 * Combines two sources of randomness:
 *  1. Math.random().toString(36) — random base-36 string (letters + digits)
 *  2. Date.now().toString(36) — current timestamp in base-36
 *
 * The combination makes collisions extremely unlikely even if called rapidly.
 * substr(2, 9) removes the leading "0." from the decimal representation.
 *
 * @returns {string} A unique alphanumeric ID like "k7x2mq1a9 1lz4f"
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * formatDate — Converts an ISO date string into a human-readable relative label.
 *
 * Returns:
 *  - 'Never' if no date is provided
 *  - 'Today' if the date is today
 *  - 'Yesterday' if the date was yesterday
 *  - 'N days ago' if within the last week
 *  - 'Jan 5' style short date for older dates
 *
 * @param {string|null} dateStr - ISO date string (e.g. "2024-01-15") or null
 * @returns {string} Human-readable date label
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'Never'; // Guard: handle null/undefined gracefully

  const date = new Date(dateStr);   // Parse the ISO string into a Date object
  const now = new Date();           // Current date/time

  // Calculate the difference in whole days between now and the given date
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;

  // For dates older than a week, use the browser's locale-aware formatter
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * getTodayStr — Returns today's date as a YYYY-MM-DD string.
 *
 * Used throughout the app for consistent date comparisons.
 * toISOString() returns "2024-01-15T10:30:00.000Z" — we split on 'T' and take [0].
 *
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

/**
 * updateStreak — Calculates the new streak state based on the last active date.
 *
 * Streak rules:
 *  - If lastDate is today → no change (already counted today's visit)
 *  - If lastDate is yesterday → increment streak by 1 (consecutive day)
 *  - Otherwise → streak broken, reset to 1 (today counts as day 1)
 *
 * This is a pure function — it returns a new streak object without mutating the input.
 *
 * @param {Object} streak - Current streak object { count, lastDate, totalMinutes }
 * @returns {Object} Updated streak object
 */
export function updateStreak(streak) {
  const today = getTodayStr(); // Today as YYYY-MM-DD

  // Calculate yesterday's date string for comparison
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Already visited today — don't double-count
  if (streak.lastDate === today) return streak;

  // Visited yesterday — streak continues, increment by 1
  if (streak.lastDate === yesterdayStr) {
    return { ...streak, count: streak.count + 1, lastDate: today };
  }

  // Missed a day (or first visit ever) — reset streak to 1
  return { ...streak, count: 1, lastDate: today };
}

/**
 * initLocalStorage — Sets up all required localStorage keys with default values.
 *
 * Called once on app startup (in App.jsx's useEffect).
 * Uses a guard check so it only writes if the key doesn't already exist,
 * preventing accidental data loss on page reload.
 *
 * Keys initialized:
 *  - 'streak': { count, lastDate, totalMinutes }
 *  - 'flashcards': []
 *  - 'quizHistory': []
 *  - 'userTopics': {}
 *  - 'chatHistory': []
 *  - 'userSettings': { name, dailyGoal }
 */
export function initLocalStorage() {
  // Only set if the key doesn't exist yet (first-time user)
  if (!localStorage.getItem('streak')) {
    localStorage.setItem('streak', JSON.stringify({ count: 0, lastDate: null, totalMinutes: 0 }));
  }
  if (!localStorage.getItem('flashcards')) {
    localStorage.setItem('flashcards', JSON.stringify([]));
  }
  if (!localStorage.getItem('quizHistory')) {
    localStorage.setItem('quizHistory', JSON.stringify([]));
  }
  if (!localStorage.getItem('userTopics')) {
    localStorage.setItem('userTopics', JSON.stringify({}));
  }
  if (!localStorage.getItem('chatHistory')) {
    localStorage.setItem('chatHistory', JSON.stringify([]));
  }
  if (!localStorage.getItem('userSettings')) {
    localStorage.setItem('userSettings', JSON.stringify({ name: 'Learner', dailyGoal: 20 }));
  }
}

/**
 * exportAllData — Bundles all localStorage data into a JSON file and triggers download.
 *
 * HOW IT WORKS:
 *  1. Reads all known localStorage keys and parses them from JSON strings
 *  2. Adds an exportedAt timestamp for reference
 *  3. Creates a Blob (binary large object) containing the JSON string
 *  4. Creates a temporary object URL pointing to that Blob
 *  5. Programmatically clicks a hidden <a> tag to trigger the browser's download
 *  6. Revokes the object URL to free memory
 *
 * The downloaded file is named: lumilearn-backup-YYYY-MM-DD.json
 */
export function exportAllData() {
  // Collect all app data from localStorage
  const data = {
    streak: JSON.parse(localStorage.getItem('streak') || '{}'),
    flashcards: JSON.parse(localStorage.getItem('flashcards') || '[]'),
    quizHistory: JSON.parse(localStorage.getItem('quizHistory') || '[]'),
    userTopics: JSON.parse(localStorage.getItem('userTopics') || '{}'),
    chatHistory: JSON.parse(localStorage.getItem('chatHistory') || '[]'),
    userSettings: JSON.parse(localStorage.getItem('userSettings') || '{}'),
    exportedAt: new Date().toISOString(), // Timestamp for the backup
  };

  // Create a Blob with the JSON string (pretty-printed with 2-space indent)
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });

  // Create a temporary URL that points to the Blob in memory
  const url = URL.createObjectURL(blob);

  // Create a hidden anchor element and simulate a click to trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = `lumilearn-backup-${getTodayStr()}.json`; // Filename with today's date
  a.click(); // Trigger the download

  // Clean up: revoke the object URL to release memory
  URL.revokeObjectURL(url);
}

/**
 * getRandomStudyTip — Returns a random study tip string from a curated list.
 *
 * Used on the Dashboard to show a different tip each session.
 * Math.random() * tips.length gives a float in [0, length),
 * Math.floor() converts it to a valid array index.
 *
 * @returns {string} A study tip with an emoji prefix
 */
export function getRandomStudyTip() {
  const tips = [
    '💡 Take a break every 25 minutes (Pomodoro technique)',
    '🧠 Teach it back to yourself out loud',
    '✍️ Writing by hand improves memory retention',
    '😴 Sleep right after studying to lock in memories',
    '🔁 Review within 24 hours to retain 80% more',
    '🎯 Focus on one topic at a time, not multi-tasking',
    '💧 Drink water — your brain is 73% water',
    '🌿 Short walks boost focus by up to 60%',
    '📵 Silence notifications during study sessions',
    '🎵 Classical music can improve concentration',
  ];

  // Pick a random index and return the corresponding tip
  return tips[Math.floor(Math.random() * tips.length)];
}
