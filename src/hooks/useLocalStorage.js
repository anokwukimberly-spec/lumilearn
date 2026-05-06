/**
 * useLocalStorage.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom React hooks for working with localStorage as persistent state.
 *
 * WHY A CUSTOM HOOK?
 * React's useState is ephemeral — state is lost on page refresh.
 * localStorage persists data between sessions, but it only stores strings.
 * This hook bridges the two: it gives you a useState-like API that
 * automatically serializes/deserializes JSON and syncs with localStorage.
 *
 * USAGE:
 *   const [value, setValue] = useLocalStorage('myKey', defaultValue);
 *   // Works exactly like useState, but persists across page reloads
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect } from 'react';

/**
 * useLocalStorage — A drop-in replacement for useState that persists to localStorage.
 *
 * HOW IT WORKS:
 *  1. On mount, reads the value from localStorage (if it exists) and parses it from JSON.
 *     If no value exists, uses the provided initialValue.
 *  2. Returns [storedValue, setValue] just like useState.
 *  3. When setValue is called, it updates both React state AND localStorage simultaneously.
 *
 * FUNCTIONAL UPDATES:
 *  setValue supports the same functional update pattern as useState:
 *    setValue(prev => [...prev, newItem])
 *  This is important for avoiding stale closure issues in async code.
 *
 * ERROR HANDLING:
 *  Both read and write operations are wrapped in try/catch to handle:
 *  - JSON.parse failures (corrupted localStorage data)
 *  - localStorage quota exceeded errors
 *  - Private browsing mode restrictions
 *
 * @param {string} key - The localStorage key to read/write
 * @param {*} initialValue - Default value if the key doesn't exist in localStorage
 * @returns {[*, Function]} [storedValue, setValue] — same API as useState
 */
export function useLocalStorage(key, initialValue) {
  // Initialize state by reading from localStorage.
  // The function passed to useState is a "lazy initializer" — it only runs once on mount,
  // not on every re-render. This is important for performance since localStorage reads
  // are synchronous and can be slow.
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key); // Read the raw string from localStorage
      // If the key exists, parse it from JSON; otherwise use the default value
      return item ? JSON.parse(item) : initialValue;
    } catch {
      // If JSON.parse fails (corrupted data), fall back to the initial value
      return initialValue;
    }
  });

  /**
   * setValue — Updates both React state and localStorage atomically.
   *
   * Supports functional updates: setValue(prev => newValue)
   * This mirrors the useState API and is necessary for correct behavior
   * when the new value depends on the previous value.
   *
   * @param {*|Function} value - New value, or a function that receives the current value
   */
  const setValue = (value) => {
    try {
      // If value is a function, call it with the current stored value (functional update)
      // Otherwise use the value directly
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Update React state (triggers re-render)
      setStoredValue(valueToStore);

      // Persist to localStorage as a JSON string
      // JSON.stringify handles objects, arrays, numbers, booleans, null
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Log errors but don't crash — the UI will still work, just won't persist
      console.error('useLocalStorage write error:', error);
    }
  };

  // Return the same [value, setter] tuple as useState
  return [storedValue, setValue];
}

/**
 * useStreak — Specialized hook for managing the daily learning streak.
 *
 * Wraps useLocalStorage with streak-specific logic:
 *  - markTodayActive(): Increments the streak if today hasn't been counted yet
 *  - addMinutes(n): Adds study time to the total minutes counter
 *
 * The streak object shape: { count: number, lastDate: string|null, totalMinutes: number }
 *
 * @returns {{ streak: Object, markTodayActive: Function, addMinutes: Function }}
 */
export function useStreak() {
  // Read/write the streak object from localStorage
  const [streak, setStreak] = useLocalStorage('streak', { count: 0, lastDate: null, totalMinutes: 0 });

  /**
   * markTodayActive — Marks today as an active study day and updates the streak.
   *
   * Called when the user performs a study action (reviewing cards, taking a quiz, etc.)
   * Idempotent: calling it multiple times on the same day has no effect.
   */
  const markTodayActive = () => {
    const today = new Date().toISOString().split('T')[0]; // Today as YYYY-MM-DD

    // Calculate yesterday's date for streak continuation check
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Already marked today — nothing to do
    if (streak.lastDate === today) return;

    // If last active was yesterday, continue the streak; otherwise start fresh
    const newCount = streak.lastDate === yesterdayStr ? streak.count + 1 : 1;
    setStreak({ ...streak, count: newCount, lastDate: today });
  };

  /**
   * addMinutes — Adds study time to the running total.
   *
   * Uses a functional update to safely read the latest value,
   * avoiding stale closure issues if called multiple times quickly.
   *
   * @param {number} mins - Number of minutes to add
   */
  const addMinutes = (mins) => {
    setStreak(prev => ({ ...prev, totalMinutes: (prev.totalMinutes || 0) + mins }));
  };

  return { streak, markTodayActive, addMinutes };
}
