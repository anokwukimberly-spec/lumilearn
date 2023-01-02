import { Link, useLocation } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  FiHome, FiBook, FiHelpCircle, FiLayers, FiMessageSquare,
  FiUser, FiZap, FiMenu, FiX
} from 'react-icons/fi';
import { useState } from 'react';

const navLinks = [
  { to: '/', label: 'Home', icon: FiHome },
  { to: '/learn', label: 'Learn', icon: FiBook },
  { to: '/quiz', label: 'Quiz', icon: FiHelpCircle },
  { to: '/flashcards', label: 'Flashcards', icon: FiLayers },
  { to: '/ai', label: 'AI Chat', icon: FiMessageSquare },
  { to: '/profile', label: 'Profile', icon: FiUser },
];

export default function Header() {
  const location = useLocation();
  const [settings] = useLocalStorage('userSettings', { name: 'Learner' });
  const [streak] = useLocalStorage('streak', { count: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-black tracking-tight text-blue-800 hover:text-blue-700">
          LumiLearn
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${
                isActive(to)
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {streak.count > 0 && (
            <span className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
              <FiZap size={13} />
              {streak.count}
            </span>
          )}
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-sm hover:bg-blue-200"
          >
            {settings.name ? settings.name.charAt(0).toUpperCase() : 'L'}
          </Link>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded border border-slate-200 text-slate-600 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-2 px-4">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg mb-0.5 ${
                isActive(to) ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
