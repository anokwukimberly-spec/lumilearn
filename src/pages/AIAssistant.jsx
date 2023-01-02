import { useState, useRef, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { askAI } from '../utils/openrouter';
import AIChatMessage from '../components/AIChatMessage';
import BlueButton from '../components/BlueButton';
import { FiSend, FiTrash2, FiCpu, FiMessageSquare } from 'react-icons/fi';

const SYSTEM_MSG = {
  role: 'system',
  content: `You are Lumi, a friendly and knowledgeable AI tutor. You explain concepts clearly using analogies, bullet points, and examples. You are encouraging and keep responses concise but thorough. When asked, you can generate quizzes, create flashcard content, or give study tips.`,
};

const WELCOME = {
  role: 'assistant',
  content: `Hey there! I'm **Lumi**, your personal AI tutor.\n\nI can help you:\n- Explain any topic simply\n- Generate quiz questions\n- Create flashcard content\n- Give you study tips\n\nWhat would you like to learn today?`,
  timestamp: new Date().toISOString(),
};

const SUGGESTIONS = [
  "Explain recursion like I'm 10",
  "What's the difference between RAM and ROM?",
  "Give me 3 tips to memorize vocabulary",
  "How does photosynthesis work?",
];

export default function AIAssistant() {
  const [chatHistory, setChatHistory] = useLocalStorage('chatHistory', []);
  const [sessionMessages, setSessionMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionMessages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setSessionMessages(prev => [...prev, userMsg]);
    setChatHistory(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = sessionMessages.filter(m => m !== WELCOME).slice(-10);
    const apiMessages = [
      SYSTEM_MSG,
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: text },
    ];

    const reply = await askAI(apiMessages);
    const aiMsg = { role: 'assistant', content: reply, timestamp: new Date().toISOString() };
    setSessionMessages(prev => [...prev, aiMsg]);
    setChatHistory(prev => [...prev, aiMsg]);
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleClear = () => {
    setSessionMessages([WELCOME]);
    setChatHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="max-w-3xl mx-auto w-full px-5 py-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-black text-blue-900">
              <FiCpu size={22} /> Lumi AI Tutor
            </h1>
            <p className="text-xs text-slate-400">Powered by Mistral 7B via OpenRouter</p>
          </div>
          <button onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 border border-slate-200 px-3 py-1.5 rounded-md bg-white cursor-pointer">
            <FiTrash2 size={12} /> Clear chat
          </button>
        </div>

        {/* Chat window */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5" style={{ minHeight: '400px', maxHeight: '60vh' }}>
            {sessionMessages.map((msg, i) => (
              <AIChatMessage key={i} message={msg} />
            ))}
            {loading && (
              <div className="flex justify-start mb-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  <FiCpu size={14} className="text-blue-600" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl rounded-bl-sm px-4 py-3">
                  <p className="text-slate-400 text-sm font-hand text-lg">
                    thinking<span className="typing-dot">.</span><span className="typing-dot">.</span><span className="typing-dot">.</span>
                  </p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips */}
          {sessionMessages.length <= 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => { setInput(s); inputRef.current?.focus(); }}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full hover:bg-blue-100 cursor-pointer">
                  <FiMessageSquare size={11} /> {s}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div className="border-t border-slate-100 p-4 flex gap-3">
            <textarea ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown} placeholder="Ask Lumi anything... (Enter to send)" rows={2}
              className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 bg-slate-50 resize-none" />
            <BlueButton onClick={handleSend} disabled={loading || !input.trim()}
              className="self-end flex items-center gap-1.5">
              <FiSend size={14} /> Send
            </BlueButton>
          </div>
        </div>

        <p className="text-xs text-center text-slate-300 mt-3">
          Messages are saved locally · AI can make mistakes · Always verify important info
        </p>
      </div>
    </div>
  );
}
