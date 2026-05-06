/**
 * main.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * The entry point of the React application.
 *
 * This file is the first JavaScript executed by the browser (after Vite's
 * module bundler processes it). It mounts the React component tree into the
 * HTML document.
 *
 * HOW REACT MOUNTING WORKS:
 *  1. index.html has a <div id="root"></div> — an empty container
 *  2. createRoot() takes that DOM element and creates a React root
 *  3. root.render() renders the <App /> component tree into that container
 *  4. React takes over the DOM from that point forward
 *
 * STRICT MODE:
 *  <StrictMode> is a development-only wrapper that:
 *  - Renders components twice to detect side effects
 *  - Warns about deprecated APIs
 *  - Has NO effect in production builds
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { StrictMode } from 'react';          // Development helper for catching bugs
import { createRoot } from 'react-dom/client'; // React 18+ concurrent rendering API
import './index.css';                          // Global styles (Tailwind + custom CSS)
import App from './App.jsx';                   // Root application component

// Find the #root div in index.html and create a React root attached to it
createRoot(document.getElementById('root')).render(
  // StrictMode wraps the entire app — only active in development
  <StrictMode>
    <App /> {/* The entire application component tree starts here */}
  </StrictMode>,
);
