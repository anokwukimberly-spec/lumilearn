import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getRandomStudyTip, formatDate } from '../utils/helpers';
import { isDueToday } from '../utils/spacedRepetition';
import StreakDisplay from '../components/StreakDisplay';
import PaperCard from '../components/PaperCard';
import BlueButton from '../components/BlueButton';
import OutlineButton from '../components/OutlineButton';
import {
  FiCalendar, FiBarChart2, FiMessageSquare, FiLayers,
  FiActivity, FiBook, FiCpu, FiArrowRight, FiCheckCircle,
  FiTarget, FiAward
} from 'react-icons/fi';
import { RiFireFill } from 'react-icons/ri';

export default function Dashboard() {
  const [streak] = useLocalStorage('streak', { count: 0, lastDate: null, totalMinutes: 0 });
  const [flashcards] = useLocalStorage('flashcards', []);
  const [quizHistory] = useLocalStorage('quizHistory', []);
  const [chatHistory] = useLocalStorage('chatHistory', []);
  const [settings] = useLocalStorage('userSettings', { name: 'Learner', dailyGoal: 20 });
  const [tip] = useState(getRandomStudyTip());

  const dueCards = flashcards.filter(isDueToday);
  const recentQuizzes = quizHistory.slice(-4).reverse();
  const lastChat = chatHistory.filter(m => m.role === 'user').slice(-3).reverse();
  const totalCards = flashcards.length;

  const avgScore = recentQuizzes.length > 0
    ? Math.round(recentQuizzes.reduce((a, q) => a + (q.score / q.totalQuestions) * 100, 0) / recentQuizzes.length)
    : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      {/* Greeting bar */}
      <div className="bg-blue-800 text-white px-5 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black mb-1">Hey, {settings.name}!</h1>
          <p className="text-blue-200 text-sm">
            {dueCards.length > 0
              ? `You have ${dueCards.length} flashcard${dueCards.length !== 1 ? 's' : ''} due for review today.`
              : 'All caught up on reviews — great work!'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-7">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">

          {/* Streak */}
          <PaperCard className="p-5 self-start" rounded="rounded-2xl">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <RiFireFill className="text-orange-400" /> Your Streak
            </p>
            <StreakDisplay count={streak.count} totalMinutes={streak.totalMinutes} size="lg" />
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <FiTarget size={11} /> Daily goal: {settings.dailyGoal} min/day
              </p>
            </div>
          </PaperCard>

          {/* Due today */}
          <PaperCard className="p-5" rounded="rounded-xl">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <FiCalendar size={12} /> Due Today
            </p>
            {dueCards.length === 0 ? (
              <div className="py-6 text-center">
                <FiCheckCircle size={36} className="text-green-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Nothing due!</p>
                <p className="text-xs text-slate-400 mt-1">Come back tomorrow</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2 mb-4">
                  {dueCards.slice(0, 3).map(card => (
                    <div key={card.id} className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-lg">
                      <FiLayers size={14} className="text-blue-400 flex-shrink-0" />
                      <p className="text-sm text-slate-700 font-medium truncate">{card.front}</p>
                    </div>
                  ))}
                  {dueCards.length > 3 && (
                    <p className="text-xs text-slate-400 pl-1">+{dueCards.length - 3} more cards</p>
                  )}
                </div>
                <Link to="/flashcards">
                  <BlueButton size="sm" className="w-full text-center">Review Now <FiArrowRight size={12} className="inline ml-1" /></BlueButton>
                </Link>
              </>
            )}
          </PaperCard>

          {/* Quick stats */}
          <PaperCard className="p-5 self-end" rounded="rounded-lg">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <FiBarChart2 size={12} /> Stats
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: totalCards, label: 'cards', bg: 'bg-blue-50', color: 'text-blue-700' },
                { val: quizHistory.length, label: 'quizzes', bg: 'bg-cyan-50', color: 'text-cyan-700' },
                { val: avgScore > 0 ? `${avgScore}%` : '—', label: 'avg score', bg: 'bg-indigo-50', color: 'text-indigo-700' },
                { val: streak.count, label: 'day streak', bg: 'bg-orange-50', color: 'text-orange-600' },
              ].map(({ val, label, bg, color }) => (
                <div key={label} className={`${bg} rounded-lg p-3 text-center`}>
                  <p className={`text-2xl font-black ${color}`}>{val}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </PaperCard>
        </div>

        {/* Middle row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">

          {/* Recent quizzes */}
          <PaperCard className="p-5" rounded="rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <FiActivity size={12} /> Recent Quizzes
              </p>
              <Link to="/quiz" className="text-xs text-blue-500 squiggly">Take one</Link>
            </div>
            {recentQuizzes.length === 0 ? (
              <div className="py-5 text-center">
                <FiActivity size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-3">No quizzes yet</p>
                <Link to="/quiz"><BlueButton size="sm">Generate Quiz</BlueButton></Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {recentQuizzes.map((quiz, i) => {
                  const pct = Math.round((quiz.score / quiz.totalQuestions) * 100);
                  return (
                    <div key={quiz.id || i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{
                          borderColor: pct >= 80 ? '#22c55e' : pct >= 60 ? '#3b82f6' : '#ef4444',
                          color: pct >= 80 ? '#16a34a' : pct >= 60 ? '#2563eb' : '#dc2626',
                        }}>
                        {pct}%
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{quiz.topic}</p>
                        <p className="text-xs text-slate-400">{quiz.score}/{quiz.totalQuestions} · {formatDate(quiz.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </PaperCard>

          {/* Recent AI chats */}
          <PaperCard className="p-5" rounded="rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <FiMessageSquare size={12} /> Recent AI Chats
              </p>
              <Link to="/ai" className="text-xs text-blue-500 squiggly">Open chat</Link>
            </div>
            {lastChat.length === 0 ? (
              <div className="py-5 text-center">
                <FiCpu size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-3">Lumi is waiting to help!</p>
                <Link to="/ai"><BlueButton size="sm">Start Chatting</BlueButton></Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {lastChat.map((msg, i) => (
                  <div key={i} className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <p className="text-xs text-blue-400 mb-1">You asked:</p>
                    <p className="text-sm text-slate-700 line-clamp-2">{msg.content}</p>
                  </div>
                ))}
                <Link to="/ai">
                  <OutlineButton size="sm" className="w-full text-center mt-1">Continue Chatting</OutlineButton>
                </Link>
              </div>
            )}
          </PaperCard>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 bg-blue-800 rounded-2xl p-6 text-white">
            <p className="text-lg font-black mb-1">Ready to learn something new?</p>
            <p className="text-blue-200 text-sm mb-5">Pick a topic and let Lumi teach you — then generate flashcards and a quiz in seconds.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/learn">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-800 font-semibold rounded-md text-sm hover:bg-blue-50 cursor-pointer">
                  <FiBook size={14} /> Start Learning
                </button>
              </Link>
              <Link to="/ai">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-transparent border-2 border-blue-400 text-white font-semibold rounded-md text-sm hover:bg-blue-700 cursor-pointer">
                  <FiCpu size={14} /> Ask AI Tutor
                </button>
              </Link>
            </div>
          </div>

          {/* Study tip */}
          <div className="sticky-note bg-amber-50 border border-amber-200 rounded-sm p-5">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2 font-hand text-base flex items-center gap-1">
              <FiAward size={13} className="text-amber-600" /> Study Tip
            </p>
            <p className="text-sm text-amber-900 leading-relaxed font-hand text-lg">{tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
