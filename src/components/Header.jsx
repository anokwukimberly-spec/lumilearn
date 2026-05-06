/**
 * Header.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The persistent top navigation bar shown on every page.
 *
 * FEATURES:
 *  - Logo linking back to home
 *  - Desktop navigation links with active state highlighting
 *  - Streak badge (shown when streak > 0)
 *  - User avatar linking to profile (shows first letter of user's name)
 *  - Mobile hamburger menu (collapses nav on small screens)
 *
 * ACTIVE STATE:
 *  The isActive() function determines which nav link is highlighted.
 *  For the home route ("/"), we check for exact match to avoid highlighting
 *  it on every page (since all paths start with "/").
 *  For other routes, we use startsWith() to highlight parent routes
 *  (e.g., "/flashcards/deck/1" would highlight the Flashcards link).
 *
 * RESPONSIVE:
 *  - Desktop (md+): Horizontal nav links visible, hamburger hidden
 *  - Mobile (<md): Nav links hidden, hamburger button visible
 *  - Mobile menu: Dropdown panel below header when hamburger is clicked
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Link, useLocation } from 'react-router-dom'; // Link for navigation, useLocation for active state
import { useLocalStorage } from '../hooks/useLocalStorage'; // Read user settings and streak
import {
  FiHome, FiBook, FiHelpCircle, FiLayers, FiMessageSquare,
  FiUser, FiZap, FiMenu, FiX
} from 'react-icons/fi'; // Feather icons for nav items
import { useState } from 'react';

// Navigation link definitions — each maps a URL path to a label and icon
// Defined outside the component to avoid recreating the array on every render
const navLinks = [
  { to: '/',           label: 'Home',       icon: FiHome },
  { to: '/learn',      label: 'Learn',      icon: FiBook },
  { to: '/quiz',       label: 'Quiz',       icon: FiHelpCircle },
  { to: '/flashcards', label: 'Flashcards', icon: FiLayers },
  { to: '/ai',         label: 'AI Chat',    icon: FiMessageSquare },
  { to: '/profile',    label: 'Profile',    icon: FiUser },
];

/**
 * Header — Sticky top navigation bar with responsive mobile menu.
 */
export default function Header() {
  const location = useLocation(); // Current URL path (e.g., "/flashcards")

  // Read user settings to display the user's name initial in the avatar
  const [settings] = useLocalStorage('userSettings', { name: 'Learner' });

  // Read streak to show the streak badge in the header
  const [streak] = useLocalStorage('streak', { count: 0 });

  // mobileOpen: controls whether the mobile dropdown menu is visible
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * isActive — Determines if a nav link should be highlighted as active.
   *
   * Special case for "/" (home): only active on exact match.
   * All other paths: active if the current URL starts with the link's path.
   * This handles nested routes (e.g., /flashcards/review → highlights Flashcards).
   *
   * @param {string} path - The nav link's path (e.g., "/flashcards")
   * @returns {boolean} True if this link should be highlighted
   */
  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    // sticky top-0 z-50: header stays at the top of the viewport while scrolling
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">

        {/* ── Logo ── */}
        {/* Links to home page, styled as the brand name */}
        <Link to="/" className="text-2xl font-black tracking-tight text-blue-800 hover:text-blue-700">
          LumiLearn
        </Link>

        {/* ── Desktop Navigation ── */}
        {/* hidden md:flex: invisible on mobile, flex row on medium+ screens */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${
                isActive(to)
                  ? 'bg-blue-100 text-blue-800'                          // Active: blue highlight
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50' // Inactive: subtle hover
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        {/* ── Right Side: Streak Badge + Avatar + Mobile Toggle ── */}
        <div className="flex items-center gap-3">

          {/* Streak badge — only shown when streak > 0 */}
          {/* hidden sm:flex: hidden on very small screens to save space */}
          {streak.count > 0 && (
            <span className="hidden sm:flex items-center gap-1 text-sm font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
              <FiZap size={13} />
              {streak.count}
            </span>
          )}

          {/* User avatar — links to profile, shows first letter of user's name */}
          <Link
            to="/profile"
            className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-800 font-bold text-sm hover:bg-blue-200"
          >
            {/* charAt(0).toUpperCase() gets the first letter, capitalized */}
            {settings.name ? settings.name.charAt(0).toUpperCase() : 'L'}
          </Link>

          {/* Mobile hamburger toggle — only visible on small screens */}
          <button
            className="md:hidden p-2 rounded border border-slate-200 text-slate-600 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {/* Show X when menu is open, hamburger when closed */}
            {mobileOpen ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {/* Conditionally rendered below the header when mobileOpen is true */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white py-2 px-4">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)} // Close menu when a link is clicked
              className={`flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg mb-0.5 ${
                isActive(to)
                  ? 'bg-blue-100 text-blue-800 font-semibold' // Active link
                  : 'text-slate-700 hover:bg-slate-50'         // Inactive link
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
