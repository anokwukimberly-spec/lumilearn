import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { exportAllData } from '../utils/helpers';
import PaperCard from '../components/PaperCard';
import BlueButton from '../components/BlueButton';
import OutlineButton from '../components/OutlineButton';
import {
  FiUser, FiTarget, FiDatabase, FiDownload, FiTrash2,
  FiSave, FiClock, FiLayers, FiActivity, FiBarChart2,
  FiBook, FiAlertTriangle, FiSettings, FiCoffee
} from 'react-icons/fi';
import { RiFireFill } from 'react-icons/ri';

export default function Profile() {
  const [settings, setSettings] = useLocalStorage('userSettings', { name: 'Learner', dailyGoal: 20 });
  const [streak] = useLocalStorage('streak', { count: 0, totalMinutes: 0 });
  const [flashcards] = useLocalStorage('flashcards', []);
  const [quizHistory] = useLocalStorage('quizHistory', []);
  const [name, setName] = useState(settings.name || '');
  const [goal, setGoal] = useState(settings.dailyGoal || 20);
  const [saved, setSaved] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetDone, setResetDone] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSettings({ name: name.trim() || 'Learner', dailyGoal: Number(goal) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (resetInput !== 'DELETE') { setResetError('Type DELETE (all caps) to confirm'); return; }
    localStorage.clear();
    setResetDone(true);
    setTimeout(() => window.location.reload(), 1500);
  };

  const hours = Math.floor((streak.totalMinutes || 0) / 60);
  const mins = (streak.totalMinutes || 0) % 60;
  const avgScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((a, q) => a + (q.score / q.totalQuestions) * 100, 0) / quizHistory.length)
    : 0;

  const statItems = [
    { label: 'Study Time', value: `${hours}h ${mins}m`, icon: FiClock, bg: 'bg-blue-50', color: 'text-blue-700' },
    { label: 'Day Streak', value: `${streak.count}`, icon: RiFireFill, bg: 'bg-orange-50', color: 'text-orange-600' },
    { label: 'Cards Created', value: flashcards.length, icon: FiLayers, bg: 'bg-cyan-50', color: 'text-cyan-700' },
    { label: 'Quizzes Taken', value: quizHistory.length, icon: FiActivity, bg: 'bg-indigo-50', color: 'text-indigo-700' },
    { label: 'Avg Quiz Score', value: avgScore > 0 ? `${avgScore}%` : '—', icon: FiBarChart2, bg: 'bg-green-50', color: 'text-green-700' },
    { label: 'Decks', value: [...new Set(flashcards.map(c => c.deck))].length, icon: FiBook, bg: 'bg-slate-50', color: 'text-slate-700' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="max-w-2xl mx-auto px-5 py-7">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-black text-blue-900 mb-1">
            <FiSettings size={22} /> Profile &amp; Settings
          </h1>
          <p className="text-sm text-slate-500">Manage your data and preferences</p>
        </div>

        {/* Settings */}
        <PaperCard className="p-6 mb-5" rounded="rounded-xl">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            <FiUser size={12} /> Your Info
          </p>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1.5">Display Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1.5">
                Daily Learning Goal:&nbsp;
                <span className="text-blue-600 font-bold">{goal} min/day</span>
              </label>
              <div className="flex items-center gap-3">
                <FiTarget size={14} className="text-blue-400 flex-shrink-0" />
                <input type="range" min={5} max={120} step={5} value={goal}
                  onChange={e => setGoal(e.target.value)} className="flex-1 accent-blue-500" />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1 pl-5">
                <span>5 min</span><span>120 min</span>
              </div>
            </div>
            <BlueButton type="submit" className="flex items-center gap-1.5 w-fit">
              <FiSave size={13} /> {saved ? 'Saved!' : 'Save Changes'}
            </BlueButton>
          </form>
        </PaperCard>

        {/* Stats */}
        <PaperCard className="p-6 mb-5" rounded="rounded-lg">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            <FiBarChart2 size={12} /> Your Stats
          </p>
          <div className="grid grid-cols-2 gap-3">
            {statItems.map(({ label, value, icon: Icon, bg, color }) => (
              <div key={label} className={`${bg} border border-slate-100 rounded-lg p-3`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={12} className={color} />
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
                <p className={`text-xl font-black ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </PaperCard>

        {/* Data management */}
        <PaperCard className="p-6 mb-5" rounded="rounded-xl">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            <FiDatabase size={12} /> Data Management
          </p>
          <p className="text-sm text-slate-500 mb-4">
            All your data lives in your browser's localStorage. Export it as a JSON backup anytime.
          </p>
          <OutlineButton onClick={exportAllData} className="flex items-center gap-1.5 mb-6">
            <FiDownload size={14} /> Export All Data (JSON)
          </OutlineButton>

          <div className="border-t border-slate-100 pt-5">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-red-600 mb-1">
              <FiAlertTriangle size={14} /> Danger Zone
            </p>
            <p className="text-xs text-slate-400 mb-3">
              This will permanently delete all your flashcards, quiz history, and settings.
            </p>
            {resetDone ? (
              <p className="text-sm text-green-600">Data cleared. Refreshing...</p>
            ) : (
              <div className="flex flex-col gap-2">
                <input value={resetInput} onChange={e => { setResetInput(e.target.value); setResetError(''); }}
                  placeholder='Type "DELETE" to confirm'
                  className="w-full px-4 py-2.5 text-sm border border-red-200 rounded-lg focus:outline-none focus:border-red-400 bg-white" />
                {resetError && <p className="text-xs text-red-500">{resetError}</p>}
                <button onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-red-50 border border-red-300 text-red-600 rounded-md hover:bg-red-100 cursor-pointer w-fit">
                  <FiTrash2 size={13} /> Reset Everything
                </button>
              </div>
            )}
          </div>
        </PaperCard>

        <div className="text-center py-5">
          <p className="flex items-center justify-center gap-2 font-hand text-2xl text-slate-400">
            Made with <FiCoffee size={18} className="text-amber-500" /> and procrastination
          </p>
          <p className="text-xs text-slate-300 mt-1">LumiLearn · All data stored locally · No account needed</p>
        </div>
      </div>
    </div>
  );
}
