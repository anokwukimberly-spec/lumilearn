import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { initLocalStorage, updateStreak } from './utils/helpers';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Learn from './pages/Learn';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import AIAssistant from './pages/AIAssistant';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

export default function App() {
  useEffect(() => {
    // Initialize localStorage on first load
    initLocalStorage();

    // Update streak for today's visit
    try {
      const stored = JSON.parse(localStorage.getItem('streak') || '{}');
      const updated = updateStreak(stored);
      if (updated.count !== stored.count || updated.lastDate !== stored.lastDate) {
        localStorage.setItem('streak', JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Streak update error:', e);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
