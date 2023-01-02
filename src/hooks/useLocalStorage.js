import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('useLocalStorage error:', error);
    }
  };

  return [storedValue, setValue];
}

export function useStreak() {
  const [streak, setStreak] = useLocalStorage('streak', { count: 0, lastDate: null, totalMinutes: 0 });

  const markTodayActive = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastDate === today) return;

    const newCount = streak.lastDate === yesterdayStr ? streak.count + 1 : 1;
    setStreak({ ...streak, count: newCount, lastDate: today });
  };

  const addMinutes = (mins) => {
    setStreak(prev => ({ ...prev, totalMinutes: (prev.totalMinutes || 0) + mins }));
  };

  return { streak, markTodayActive, addMinutes };
}
