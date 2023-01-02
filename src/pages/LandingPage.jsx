import { Link } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { isDueToday } from '../utils/spacedRepetition';
import StreakDisplay from '../components/StreakDisplay';
import PaperCard from '../components/PaperCard';
import BlueButton from '../components/BlueButton';
import {
  FiZap, FiLayers, FiActivity, FiCheckCircle, FiStar,
  FiBarChart2, FiMessageSquare, FiBook, FiArrowRight, FiCpu
} from 'react-icons/fi';
import { RiFireFill } from 'react-icons/ri';

export default function LandingPage() {
  const [streak] = useLocalStorage('streak', { count: 0, totalMinutes: 0 });
  const [flashcards] = useLocalStorage('flashcards', []);
  const [quizHistory] = useLocalStorage('quizHistory', []);
  const [chatHistory] = useLocalStorage('chatHistory', []);

  const dueCards = flashcards.filter(isDueToday);
  const lastQuiz = quizHistory.length > 0 ? quizHistory[quizHistory.length - 1] : null;
  const lastChat = chatHistory.filter(m => m.role === 'user').slice(-1)[0];

  const features = [
    { icon: FiCpu, title: 'AI Tutor', desc: 'Ask anything. Get clear explanations with examples, analogies, and follow-up quizzes.' },
    { icon: FiLayers, title: 'Spaced Repetition', desc: 'Flashcards that schedule themselves. Review at the exact moment before you forget.' },
    { icon: RiFireFill, title: 'Daily Streak', desc: 'Build a habit with daily learning streaks. Every day counts.' },
    { icon: FiActivity, title: 'Smart Quizzes', desc: 'AI generates 5 multiple-choice questions on any topic in seconds.' },
    { icon: FiBarChart2, title: 'Progress Tracking', desc: 'See your scores, streaks, and study time all in one place.' },
  ];

  const checks = ['No account needed', '100% private', 'Works offline', 'Free forever'];

  return (
    <div style={{ backgroundColor: '#f0f4f8' }}>
      {/* HERO */}
      <section className="bg-dots relative overflow-hidden">
        {/* Floating abstract shapes */}
        <div className="absolute top-10 right-16 w-40 h-40 rounded-full opacity-20" style={{ backgroundColor: '#3b82f6', transform: 'rotate(12deg)' }} />
        <div className="absolute top-32 right-40 w-24 h-24 rounded-2xl opacity-15" style={{ backgroundColor: '#06b6d4', transform: 'rotate(-8deg)' }} />
        <div className="absolute bottom-8 right-12 w-32 h-32 opacity-10" style={{ backgroundColor: '#1d4ed8', borderRadius: '40% 60% 70% 30%', transform: 'rotate(20deg)' }} />
        <div className="absolute top-20 left-8 w-16 h-16 rounded-full opacity-10" style={{ backgroundColor: '#93c5fd' }} />

        <div className="max-w-6xl mx-auto px-5 py-16 relative z-10">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-semibold text-blue-500 mb-4 uppercase tracking-widest">
              <FiStar size={14} /> Your Personal AI Learning System
            </p>

            <h1 className="text-5xl sm:text-6xl font-black text-blue-900 leading-tight mb-5">
              Learn Smarter<br />
              <span className="text-blue-500">with AI</span>
            </h1>

            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
              Flashcards, quizzes, and an AI tutor that actually helps —
              all in your browser, no account needed.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link to="/learn">
                <button className="flex items-center gap-2 px-7 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md text-base cursor-pointer">
                  Start Learning <FiArrowRight size={16} />
                </button>
              </Link>
              <Link to="/ai">
                <button className="flex items-center gap-2 px-7 py-3.5 bg-transparent border-2 border-blue-400 hover:border-blue-500 hover:bg-blue-50 text-blue-700 font-bold rounded-md text-base cursor-pointer">
                  <FiCpu size={16} /> Try AI Tutor
                </button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {checks.map(t => (
                <span key={t} className="flex items-center gap-1 text-xs px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full font-medium">
                  <FiCheckCircle size={11} /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATUS BAR */}
      <div className="bg-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-5 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <RiFireFill size={20} className="text-orange-400" />
            <div>
              <span className="font-bold">{streak.count} day streak</span>
              <span className="text-blue-300 ml-2 text-xs">keep it up!</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiLayers size={18} className="text-blue-300" />
            <div>
              <span className="font-bold">{dueCards.length} cards</span>
              <span className="text-blue-300 ml-2 text-xs">due for review</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FiActivity size={18} className="text-blue-300" />
            <div>
              <span className="font-bold">{quizHistory.length} quizzes</span>
              <span className="text-blue-300 ml-2 text-xs">completed so far</span>
            </div>
          </div>
        </div>
      </div>

      {/* THREE COLUMN PREVIEW */}
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Streak */}
          <PaperCard className="p-5 self-start" rounded="rounded-2xl">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <RiFireFill className="text-orange-400" /> Your Streak
            </p>
            <StreakDisplay count={streak.count} totalMinutes={streak.totalMinutes} size="md" />
            {streak.count === 0 && <p className="text-xs text-slate-400 mt-3">Start studying today to begin your streak!</p>}
            <Link to="/profile" className="text-xs text-blue-500 squiggly mt-3 block">View profile</Link>
          </PaperCard>

          {/* Quiz preview */}
          <PaperCard className="p-5" rounded="rounded-xl">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <FiActivity size={12} className="text-blue-400" /> Latest Quiz
            </p>
            {lastQuiz ? (
              <div>
                <p className="font-semibold text-slate-700 mb-1">{lastQuiz.topic}</p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-black text-blue-700">
                    {Math.round((lastQuiz.score / lastQuiz.totalQuestions) * 100)}%
                  </span>
                  <span className="text-sm text-slate-500">{lastQuiz.score}/{lastQuiz.totalQuestions} correct</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${(lastQuiz.score / lastQuiz.totalQuestions) * 100}%` }} />
                </div>
                <Link to="/quiz" className="text-xs text-blue-500 squiggly mt-3 block">Take another</Link>
              </div>
            ) : (
              <div className="py-5 text-center">
                <FiActivity size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-3">No quizzes yet</p>
                <Link to="/quiz"><BlueButton size="sm">Generate Quiz</BlueButton></Link>
              </div>
            )}
          </PaperCard>

          {/* Recent chat */}
          <PaperCard className="p-5 self-end" rounded="rounded-lg">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              <FiMessageSquare size={12} className="text-blue-400" /> Recent Chat
            </p>
            {lastChat ? (
              <div>
                <p className="text-xs text-blue-400 mb-1">You asked:</p>
                <p className="text-sm text-slate-700 italic mb-3 line-clamp-3">"{lastChat.content}"</p>
                <Link to="/ai" className="text-xs text-blue-500 squiggly">Continue conversation</Link>
              </div>
            ) : (
              <div className="py-5 text-center">
                <FiCpu size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm mb-3">Lumi is ready to help</p>
                <Link to="/ai"><BlueButton size="sm">Start Chatting</BlueButton></Link>
              </div>
            )}
          </PaperCard>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-6xl mx-auto px-5 pb-10">
        <div className="mb-7">
          <h2 className="text-2xl font-black text-blue-900 mb-2">Everything you need to learn effectively</h2>
          <p className="text-slate-500 text-sm">Five powerful features, zero fluff.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            const radii = ['rounded-2xl', 'rounded-lg', 'rounded-xl', 'rounded-sm', 'rounded-xl'];
            return (
              <div key={f.title} className={`bg-white border border-slate-200 p-5 ${radii[i]} ${i === 2 ? 'rotate-half' : ''}`}>
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-blue-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}

          <div className="bg-blue-800 rounded-xl p-5 text-white flex flex-col justify-between">
            <div>
              <p className="font-black text-lg mb-2">Ready to start?</p>
              <p className="text-blue-200 text-sm mb-5">It's free. No sign-up. Just open and learn.</p>
            </div>
            <Link to="/learn">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-blue-800 font-bold rounded-md text-sm hover:bg-blue-50 cursor-pointer">
                Start Learning <FiArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-5 py-12">
          <h2 className="text-2xl font-black text-blue-900 mb-7">How LumiLearn works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Pick a topic', desc: 'Type anything you want to learn about', Icon: FiBook },
              { step: '2', title: 'Get a lesson', desc: 'AI generates a clear, concise explanation', Icon: FiCpu },
              { step: '3', title: 'Create flashcards', desc: 'One click to turn your lesson into review cards', Icon: FiLayers },
              { step: '4', title: 'Test yourself', desc: 'Take quizzes and review with spaced repetition', Icon: FiActivity },
            ].map(({ step, title, desc, Icon }) => (
              <div key={step} className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-black text-sm flex items-center justify-center flex-shrink-0">
                    {step}
                  </span>
                  <Icon size={16} className="text-blue-400" />
                </div>
                <p className="font-bold text-slate-800 mb-1">{title}</p>
                <p className="text-sm text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
