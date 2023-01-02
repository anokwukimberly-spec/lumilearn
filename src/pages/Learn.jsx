import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateLesson, generateFlashcardsFromTopic } from '../utils/openrouter';
import { generateId, getTodayStr } from '../utils/helpers';
import PaperCard from '../components/PaperCard';
import BlueButton from '../components/BlueButton';
import StickyNote from '../components/StickyNote';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FiBook, FiPlus, FiX, FiRefreshCw, FiLayers, FiCheckCircle
} from 'react-icons/fi';

const DEFAULT_TOPICS = ['React Basics', 'Python Functions', 'French Verbs', 'World History', 'Photosynthesis'];

export default function Learn() {
  const [topics, setTopics] = useLocalStorage('userTopics', {});
  const [flashcards, setFlashcards] = useLocalStorage('flashcards', []);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [newTopicInput, setNewTopicInput] = useState('');
  const [lesson, setLesson] = useState('');
  const [loading, setLoading] = useState(false);
  const [flashcardLoading, setFlashcardLoading] = useState(false);
  const [flashcardMsg, setFlashcardMsg] = useState('');

  const topicList = Object.keys(topics);

  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    setFlashcardMsg('');
    if (topics[topic]) { setLesson(topics[topic]); return; }
    setLoading(true);
    setLesson('');
    const content = await generateLesson(topic);
    setLesson(content);
    setTopics(prev => ({ ...prev, [topic]: content }));
    setLoading(false);
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    const trimmed = newTopicInput.trim();
    if (!trimmed) return;
    if (!topics[trimmed]) setTopics(prev => ({ ...prev, [trimmed]: '' }));
    setNewTopicInput('');
    handleSelectTopic(trimmed);
  };

  const handleRegenerate = () => {
    setLesson('');
    setTopics(p => ({ ...p, [selectedTopic]: '' }));
    handleSelectTopic(selectedTopic);
  };

  const handleGenerateFlashcards = async () => {
    if (!selectedTopic) return;
    setFlashcardLoading(true);
    setFlashcardMsg('');
    const cards = await generateFlashcardsFromTopic(selectedTopic);
    if (!cards.length) {
      setFlashcardMsg('Could not generate cards. Try again.');
      setFlashcardLoading(false);
      return;
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const newCards = cards.map(c => ({
      id: generateId(), front: c.front, back: c.back, deck: selectedTopic,
      easeFactor: 2.5, interval: 1, repetitions: 0,
      nextReview: tomorrow.toISOString().split('T')[0], createdAt: getTodayStr(),
    }));
    setFlashcards(prev => [...prev, ...newCards]);
    setFlashcardMsg(`Added ${newCards.length} flashcards for "${selectedTopic}"!`);
    setFlashcardLoading(false);
  };

  const handleDeleteTopic = (topic) => {
    setTopics(prev => { const c = { ...prev }; delete c[topic]; return c; });
    if (selectedTopic === topic) { setSelectedTopic(''); setLesson(''); }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="max-w-6xl mx-auto px-5 py-7">
        <div className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-black text-blue-900 mb-1">
            <FiBook size={22} /> Learn
          </h1>
          <p className="text-sm text-slate-500">Pick a topic and let AI generate a lesson for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <PaperCard className="p-4" rounded="rounded-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Your Topics</p>
              {topicList.length === 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-400 mb-2">Try one of these:</p>
                  {DEFAULT_TOPICS.map(t => (
                    <button key={t} onClick={() => handleSelectTopic(t)}
                      className="flex items-center gap-1.5 w-full text-left text-xs text-blue-600 hover:text-blue-800 py-1.5 px-2 hover:bg-blue-50 rounded cursor-pointer">
                      <FiBook size={11} /> {t}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-1 mb-4">
                {topicList.map(topic => (
                  <div key={topic}
                    className={`flex items-center justify-between p-2 rounded-lg group cursor-pointer ${selectedTopic === topic ? 'bg-blue-100 border border-blue-200' : 'hover:bg-slate-50'}`}
                    onClick={() => handleSelectTopic(topic)}>
                    <span className={`text-sm truncate ${selectedTopic === topic ? 'text-blue-800 font-semibold' : 'text-slate-700'}`}>{topic}</span>
                    <button onClick={e => { e.stopPropagation(); handleDeleteTopic(topic); }}
                      className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 cursor-pointer ml-1">
                      <FiX size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddTopic} className="flex flex-col gap-2">
                <input value={newTopicInput} onChange={e => setNewTopicInput(e.target.value)}
                  placeholder="New topic..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white" />
                <BlueButton type="submit" size="sm" className="w-full flex items-center justify-center gap-1.5">
                  <FiPlus size={13} /> Add Topic
                </BlueButton>
              </form>
            </PaperCard>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            {!selectedTopic ? (
              <PaperCard className="p-10 text-center" rounded="rounded-2xl">
                <FiBook size={40} className="text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium mb-2">No topic selected</p>
                <p className="text-sm text-slate-400">Add a topic in the sidebar or pick a suggestion to get started.</p>
              </PaperCard>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-black text-blue-900">{selectedTopic}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">AI-generated lesson</p>
                  </div>
                  <BlueButton size="sm" onClick={handleRegenerate} disabled={loading}
                    className="flex items-center gap-1.5">
                    <FiRefreshCw size={13} /> {loading ? 'Loading...' : 'Regenerate'}
                  </BlueButton>
                </div>

                <PaperCard className="p-6" rounded="rounded-xl">
                  {loading ? (
                    <div className="py-12 text-center">
                      <p className="text-slate-400 font-hand text-xl">
                        thinking<span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
                      </p>
                    </div>
                  ) : lesson ? (
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center py-8">Content will appear here</p>
                  )}
                </PaperCard>

                {lesson && !loading && (
                  <StickyNote rotate="-1" className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-hand text-xl text-amber-800 font-semibold mb-1 flex items-center gap-1.5">
                          <FiLayers size={16} className="text-amber-700" /> Generate Flashcards
                        </p>
                        <p className="text-sm text-amber-700">Turn this lesson into spaced repetition flashcards</p>
                        {flashcardMsg && (
                          <p className="flex items-center gap-1.5 text-sm text-green-700 mt-2 font-medium">
                            <FiCheckCircle size={13} /> {flashcardMsg}
                          </p>
                        )}
                      </div>
                      <button onClick={handleGenerateFlashcards} disabled={flashcardLoading}
                        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold text-sm rounded-md border border-amber-500 cursor-pointer disabled:opacity-50">
                        <FiLayers size={13} /> {flashcardLoading ? 'Creating...' : 'Create Cards'}
                      </button>
                    </div>
                  </StickyNote>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
