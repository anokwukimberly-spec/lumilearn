import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateQuiz, explainWrongAnswer } from '../utils/openrouter';
import { generateId, getTodayStr, formatDate } from '../utils/helpers';
import PaperCard from '../components/PaperCard';
import BlueButton from '../components/BlueButton';
import OutlineButton from '../components/OutlineButton';
import QuizCard from '../components/QuizCard';
import ProgressBar from '../components/ProgressBar';
import { FiActivity, FiArrowRight, FiArrowLeft, FiX, FiAward, FiHelpCircle, FiRefreshCw, FiCpu, FiCheckCircle } from 'react-icons/fi';

export default function Quiz() {
  const [quizHistory, setQuizHistory] = useLocalStorage('quizHistory', []);
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [explanations, setExplanations] = useState({});
  const [explainingIdx, setExplainingIdx] = useState(null);
  const [view, setView] = useState('home');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setGenerating(true);
    setQuestions([]); setAnswers({}); setCurrentQ(0); setShowAnswer(false); setExplanations({});
    const qs = await generateQuiz(topic.trim());
    setQuestions(qs);
    setGenerating(false);
    setView('quiz');
  };

  const handleNext = () => {
    setShowAnswer(false);
    if (currentQ + 1 >= questions.length) {
      const score = questions.filter((q, i) => answers[i] === q.correct).length;
      setQuizHistory(prev => [...prev, { id: generateId(), topic, date: getTodayStr(), score, totalQuestions: questions.length, questions }]);
      setView('results');
    } else {
      setCurrentQ(prev => prev + 1);
    }
  };

  const handleExplain = async (idx) => {
    const q = questions[idx];
    setExplainingIdx(idx);
    const text = await explainWrongAnswer(q.question, q.options[answers[idx]], q.options[q.correct]);
    setExplanations(prev => ({ ...prev, [idx]: text }));
    setExplainingIdx(null);
  };

  const score = questions.filter((q, i) => answers[i] === q.correct).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="max-w-3xl mx-auto px-5 py-7">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-black text-blue-900 mb-1"><FiActivity size={22} /> Quiz</h1>
          <p className="text-sm text-slate-500">Test your knowledge with AI-generated questions</p>
        </div>

        {view === 'home' && (
          <div className="flex flex-col gap-5">
            <PaperCard className="p-6" rounded="rounded-2xl">
              <p className="font-semibold text-slate-700 mb-4">Generate a new quiz</p>
              <form onSubmit={handleGenerate} className="flex gap-3">
                <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter a topic (e.g. 'Python loops')"
                  className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
                <BlueButton type="submit" disabled={generating || !topic.trim()} className="flex items-center gap-1.5">
                  <FiArrowRight size={14} /> {generating ? 'Building...' : 'Generate'}
                </BlueButton>
              </form>
              {generating && (
                <p className="text-sm text-slate-400 mt-3 font-hand text-lg">
                  thinking<span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
                </p>
              )}
            </PaperCard>
            {quizHistory.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Past Quizzes</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[...quizHistory].reverse().slice(0, 6).map((q, i) => {
                    const p = Math.round((q.score / q.totalQuestions) * 100);
                    return (
                      <PaperCard key={q.id || i} className="p-4" rounded={i % 2 === 0 ? 'rounded-lg' : 'rounded-xl'}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-black flex-shrink-0 ${p >= 80 ? 'border-green-400 text-green-600' : p >= 60 ? 'border-blue-400 text-blue-600' : 'border-red-300 text-red-500'}`}>{p}%</div>
                          <div><p className="font-semibold text-sm text-slate-700 truncate">{q.topic}</p><p className="text-xs text-slate-400">{q.score}/{q.totalQuestions} · {formatDate(q.date)}</p></div>
                        </div>
                      </PaperCard>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'quiz' && questions.length > 0 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-600"><FiHelpCircle size={14} /> Question {currentQ + 1} of {questions.length}</p>
              <button onClick={() => setView('home')} className="text-slate-400 hover:text-slate-600 cursor-pointer"><FiX size={16} /></button>
            </div>
            <ProgressBar value={currentQ} max={questions.length} />
            <PaperCard className="p-6" rounded="rounded-2xl">
              <QuizCard question={questions[currentQ].question} options={questions[currentQ].options}
                selectedIndex={answers[currentQ] ?? null} onSelect={idx => { if (!showAnswer) setAnswers(p => ({ ...p, [currentQ]: idx })); }}
                showAnswer={showAnswer} correctIndex={questions[currentQ].correct} />
              <div className="mt-6 flex gap-3">
                {answers[currentQ] !== undefined && !showAnswer && <BlueButton onClick={() => setShowAnswer(true)}>Check Answer</BlueButton>}
                {showAnswer && <BlueButton onClick={handleNext} className="flex items-center gap-1.5">{currentQ + 1 >= questions.length ? 'See Results' : 'Next'} <FiArrowRight size={14} /></BlueButton>}
              </div>
            </PaperCard>
          </div>
        )}

        {view === 'results' && (
          <div className="flex flex-col gap-5">
            <PaperCard className="p-7 text-center" rounded="rounded-2xl">
              <FiAward size={48} className={`mx-auto mb-3 ${pct >= 80 ? 'text-yellow-400' : pct >= 60 ? 'text-blue-400' : 'text-slate-300'}`} />
              <h2 className="text-3xl font-black text-blue-900 mb-1">{score}/{questions.length}</h2>
              <p className="text-slate-500 mb-2">{pct}% on "{topic}"</p>
              <p className="text-sm text-slate-400 mb-5">{pct >= 80 ? 'Excellent work!' : pct >= 60 ? 'Good job, keep practicing!' : "Keep going, you'll get there!"}</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <BlueButton onClick={() => { setView('home'); setTopic(''); }} className="flex items-center gap-1.5"><FiRefreshCw size={13} /> New Quiz</BlueButton>
                <OutlineButton onClick={() => { setView('quiz'); setCurrentQ(0); setAnswers({}); setShowAnswer(false); }} className="flex items-center gap-1.5"><FiArrowLeft size={13} /> Review Answers</OutlineButton>
              </div>
            </PaperCard>
            {questions.some((q, i) => answers[i] !== q.correct) && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Review Wrong Answers</p>
                {questions.map((q, i) => {
                  if (answers[i] === q.correct) return null;
                  return (
                    <PaperCard key={i} className="p-4 mb-3" rounded="rounded-lg">
                      <p className="text-sm font-semibold text-slate-700 mb-2">{q.question}</p>
                      <p className="text-xs text-red-500 mb-1">Your answer: {q.options[answers[i]] ?? 'Not answered'}</p>
                      <p className="flex items-center gap-1 text-xs text-green-600 mb-3"><FiCheckCircle size={11} /> Correct: {q.options[q.correct]}</p>
                      {explanations[i] && <p className="text-xs text-slate-600 bg-blue-50 p-2.5 rounded-lg mb-3">{explanations[i]}</p>}
                      {explainingIdx === i ? <p className="text-xs text-slate-400 font-hand text-base">thinking...</p>
                        : !explanations[i] && <OutlineButton size="sm" onClick={() => handleExplain(i)} disabled={explainingIdx !== null} className="flex items-center gap-1.5"><FiCpu size={12} /> Explain this</OutlineButton>}
                    </PaperCard>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
