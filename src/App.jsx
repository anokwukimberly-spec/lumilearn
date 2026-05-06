/**
 * App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The root component of LumiLearn. This is the top of the component tree.
 *
 * RESPONSIBILITIES:
 *  1. Sets up client-side routing with React Router (BrowserRouter)
 *  2. Initializes localStorage with default values on first load
 *  3. Updates the daily learning streak on every app visit
 *  4. Renders the persistent Header and Footer around all page routes
 *
 * ROUTING:
 *  Uses React Router v7's <Routes> and <Route> components.
 *  Each <Route> maps a URL path to a page component.
 *  The path="*" catch-all route renders the 404 page for unknown URLs.
 *
 * LAYOUT:
 *  The outer div uses flexbox column layout with min-h-screen so the Footer
 *  always sticks to the bottom even on short pages (flex-1 on <main> fills space).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom'; // Client-side routing
import { useEffect } from 'react';                                // Side effect hook
import { initLocalStorage, updateStreak } from './utils/helpers'; // App initialization utilities
import Header from './components/Header';                         // Persistent top navigation
import Footer from './components/Footer';                         // Persistent bottom footer
import LandingPage from './pages/LandingPage';                    // Home / marketing page
import Dashboard from './pages/Dashboard';                        // User's study dashboard
import Learn from './pages/Learn';                                // AI lesson generator
import Quiz from './pages/Quiz';                                  // AI quiz generator
import Flashcards from './pages/Flashcards';                      // Spaced repetition flashcards
import AIAssistant from './pages/AIAssistant';                    // AI chat tutor (Lumi)
import Profile from './pages/Profile';                            // User settings & stats
import NotFound from './pages/NotFound';                          // 404 error page

export default function App() {
  /**
   * Initialization effect — runs once when the app first mounts.
   *
   * 1. initLocalStorage(): Creates all required localStorage keys with defaults
   *    if they don't already exist. Safe to call on every load.
   *
   * 2. Streak update: Reads the current streak, applies the updateStreak logic,
   *    and writes back only if something changed. This ensures the streak
   *    increments on the first visit of each new day.
   */
  useEffect(() => {
    // Set up localStorage keys with default values (only if they don't exist yet)
    initLocalStorage();

    // Update the daily streak for today's visit
    try {
      // Read the current streak object from localStorage
      const stored = JSON.parse(localStorage.getItem('streak') || '{}');

      // Calculate the updated streak (pure function — returns new object)
      const updated = updateStreak(stored);

      // Only write back if something actually changed (avoids unnecessary writes)
      if (updated.count !== stored.count || updated.lastDate !== stored.lastDate) {
        localStorage.setItem('streak', JSON.stringify(updated));
      }
    } catch (e) {
      // If localStorage is unavailable or data is corrupted, log and continue
      console.error('Streak update error:', e);
    }
  }, []); // Empty dependency array = run only once on mount

  return (
    // BrowserRouter: enables HTML5 history API routing (clean URLs without #)
    <BrowserRouter>
      {/* Flex column layout: Header + main content + Footer stacked vertically */}
      <div className="flex flex-col min-h-screen">

        {/* Header: always visible, contains navigation links and streak badge */}
        <Header />

        {/* Main content area: flex-1 makes it grow to fill available space */}
        <main className="flex-1">
          <Routes>
            {/* Landing page — the home/marketing page */}
            <Route path="/" element={<LandingPage />} />

            {/* Dashboard — personalized study overview */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Learn — AI-generated lessons + flashcard creation */}
            <Route path="/learn" element={<Learn />} />

            {/* Quiz — AI-generated multiple choice quizzes */}
            <Route path="/quiz" element={<Quiz />} />

            {/* Flashcards — spaced repetition review board */}
            <Route path="/flashcards" element={<Flashcards />} />

            {/* AI Assistant — chat with Lumi, the AI tutor */}
            <Route path="/ai" element={<AIAssistant />} />

            {/* Profile — user settings, stats, and data management */}
            <Route path="/profile" element={<Profile />} />

            {/* Catch-all: renders 404 page for any unmatched URL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer: always visible at the bottom */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
