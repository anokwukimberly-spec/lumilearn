import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateNextReview, isDueToday, isDueTomorrow, isMastered } from '../utils/spacedRepetition';
import { generateId, getTodayStr } from '../utils/helpers';
import PaperCard from '../components/PaperCard';
import BlueButton from '../components/BlueButton';
import FlashcardComponent from '../components/Flashcard';
import { FiLayers, FiPlus, FiX, FiCheckCircle, FiClock, FiPackage } from 'react-icons/fi';

export default function Flashcards() {
  const [flashcards, setFlashcards] = useLocalStorage('flashcards', []);
  const [showForm, setShowForm] = useState(false);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [deck, setDeck] = useState('General');
  const [reviewIdx, setReviewIdx] = useState(0);
  const [mode, setMode] = useState('kanban');

  const due = flashcards.fi
  lter(isDueToday);
  const tomorrow = flashcards.filter(c => !isDueToday(c) && isDueTomorrow(c));
  const mastered = flashcards.filter(isMastered);
  const other = flashcards.filter(c => !isDueToday(c) && !isDueTomorrow(c) && !isMastered(c));

  const handleEasy = (card) => {
    setFlashcards(prev => prev.map(c => c.id === card.id ? calculateNextReview(card, 5) : c));
    if (reviewIdx < due.length - 1) setReviewIdx(prev => prev + 1);
    else setReviewIdx(due.length);
  };

  const handleHard = (card) => {
    setFlashcards(prev => prev.map(c => c.id === card.id ? calculateNextReview(card, 2) : c));
    if (reviewIdx < due.length - 1) setReviewIdx(prev => prev + 1);
    else setReviewIdx(due.length);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const newCard = {
      id: generateId(), front: front.trim(), back: back.trim(),
      deck: deck.trim() || 'General', easeFactor: 2.5, interval: 1,
      repetitions: 0, nextReview: tomorrow.toISOString().split('T')[0], createdAt: getTodayStr(),
    };
    setFlashcards(prev => [...prev, newCard]);
    setFront(''); setBack(''); setShowForm(false);
  };

  const handleDelete = (id) => setFlashcards(prev => prev.filter(c => c.id !== id));

  const KanbanColumn = ({ title, icon: Icon, iconColor, cards, emptyMsg, borderColor }) => (
    <div className="flex flex-col gap-3">
      <div className={`flex items-center gap-2 pb-2 border-b-2 ${borderColor}`}>
        <Icon size={14} className={iconColor} />
        <span className="font-bold text-sm text-slate-700">{title}</span>
        <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-2 py-0.5">{cards.length}</span>
      </div>
      {cards.length === 0 ? (
        <p className="text-xs text-slate-400 py-3 text-center">{emptyMsg}</p>
      ) : (
        cards.slice(0, 8).map((card, i) => (
          <div key={card.id} style={{ marginTop: i % 3 === 1 ? '2px' : '0' }}
            className="bg-white border border-slate-200 rounded-lg p-3 group relative">
            <p className="text-sm font-semibold text-slate-800 mb-1 pr-5">{card.front}</p>
            <p className="text-xs text-slate-400 line-clamp-2">{card.back}</p>
            <span className="text-xs text-blue-400 mt-1 block">{card.deck}</span>
            <button onClick={() => handleDelete(card.id)}
              className="absolute top-2 right-2 text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer">
              <FiX size={13} />
            </button>
          </div>
        ))
      )}
      {cards.length > 8 && <p className="text-xs text-slate-400 text-center">+{cards.length - 8} more</p>}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="max-w-6xl mx-auto px-5 py-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-blue-900 mb-1"><FiLayers size={22} /> Flashcards</h1>
            <p className="text-sm text-slate-500">{flashcards.length} cards total · {due.length} due today</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {due.length > 0 && (
              <BlueButton size="sm" onClick={() => { setMode('review'); setReviewIdx(0); }} className="flex items-center gap-1.5">
                Study Now ({due.length})
              </BlueButton>
            )}
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer">
              <FiPlus size={14} /> New Card
            </button>
          </div>
        </div>

        {showForm && (
          <PaperCard className="p-5 mb-5" rounded="rounded-xl">
            <p className="font-semibold text-slate-700 mb-4">Add a new flashcard</p>
            <form onSubmit={handleAddCard} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Front (question / term)</label>
                  <textarea value={front} onChange={e => setFront(e.target.value)} placeholder="What do you want to remember?" rows={3}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white resize-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Back (answer / definition)</label>
                  <textarea value={back} onChange={e => setBack(e.target.value)} placeholder="The answer..." rows={3}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white resize-none" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input value={deck} onChange={e => setDeck(e.target.value)} placeholder="Deck name"
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
                <BlueButton type="submit">Save Card</BlueButton>
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-500 hover:text-slate-700 cursor-pointer">Cancel</button>
              </div>
            </form>
          </PaperCard>
        )}

        {mode === 'review' && due.length > 0 && (
          <div className="mb-7">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600">
                Reviewing {Math.min(reviewIdx + 1, due.length)} of {due.length}
              </p>
              <button onClick={() => { setMode('kanban'); setReviewIdx(0); }}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 cursor-pointer">
                <FiX size={13} /> Exit Review
              </button>
            </div>
            {reviewIdx < due.length ? (
              <div className="max-w-md mx-auto">
                <FlashcardComponent card={due[reviewIdx]} onEasy={handleEasy} onHard={handleHard} />
                <p className="text-center text-xs text-slate-400 mt-3">Tap card to reveal · Then rate yourself</p>
              </div>
            ) : (
              <PaperCard className="p-8 text-center max-w-md mx-auto" rounded="rounded-2xl">
                <FiCheckCircle size={48} className="text-green-400 mx-auto mb-3" />
                <p className="font-black text-blue-900 text-xl mb-2">All done!</p>
                <p className="text-sm text-slate-500 mb-4">You reviewed all {due.length} cards.</p>
                <BlueButton onClick={() => { setMode('kanban'); setReviewIdx(0); }}>Back to Board</BlueButton>
              </PaperCard>
            )}
          </div>
        )}

        {mode === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <KanbanColumn title="Due Today" icon={FiPackage} iconColor="text-orange-400" cards={due} emptyMsg="Nothing due — great job!" borderColor="border-orange-300" />
            <KanbanColumn title="Coming Up" icon={FiClock} iconColor="text-blue-400" cards={[...tomorrow, ...other]} emptyMsg="No upcoming cards" borderColor="border-blue-200" />
            <KanbanColumn title="Mastered" icon={FiCheckCircle} iconColor="text-green-500" cards={mastered} emptyMsg="Keep reviewing to master cards" borderColor="border-green-300" />
          </div>
        )}

        {flashcards.length === 0 && (
          <PaperCard className="p-10 text-center mt-5" rounded="rounded-2xl">
            <FiLayers size={40} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium mb-2">No flashcards yet</p>
            <p className="text-sm text-slate-400 mb-4">Create cards manually or generate them from a lesson on the Learn page.</p>
            <BlueButton onClick={() => setShowForm(true)} className="flex items-center gap-1.5 mx-auto">
              <FiPlus size={14} /> Create Your First Card
            </BlueButton>
          </PaperCard>
        )}
      </div>
    </div>
  );
}
