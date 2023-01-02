export function generateId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function formatDate(dateStr) {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

export function updateStreak(streak) {
  const today = getTodayStr();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (streak.lastDate === today) return streak;

  if (streak.lastDate === yesterdayStr) {
    return { ...streak, count: streak.count + 1, lastDate: today };
  }

  // Streak broken
  return { ...streak, count: 1, lastDate: today };
}

export function initLocalStorage() {
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

export function exportAllData() {
  const data = {
    streak: JSON.parse(localStorage.getItem('streak') || '{}'),
    flashcards: JSON.parse(localStorage.getItem('flashcards') || '[]'),
    quizHistory: JSON.parse(localStorage.getItem('quizHistory') || '[]'),
    userTopics: JSON.parse(localStorage.getItem('userTopics') || '{}'),
    chatHistory: JSON.parse(localStorage.getItem('chatHistory') || '[]'),
    userSettings: JSON.parse(localStorage.getItem('userSettings') || '{}'),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lumilearn-backup-${getTodayStr()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

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
  return tips[Math.floor(Math.random() * tips.length)];
}
