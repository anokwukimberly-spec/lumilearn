# 🎓 LumiLearn — AI-Powered Learning Platform

**Learn smarter with AI-generated lessons, spaced repetition flashcards, and an intelligent tutor — all in your browser, no account needed.**

---

## 🌟 Overview

LumiLearn is a modern, browser-based learning platform that combines cutting-edge AI with proven learning science. It's designed for self-directed learners who want to master any topic efficiently.

**Core Philosophy:**
- **AI-First:** Every feature is powered by AI (via OpenRouter)
- **Privacy-First:** All data stays in your browser (localStorage)
- **Science-Backed:** Uses the SM-2 spaced repetition algorithm
- **Zero Friction:** No accounts, no servers, no setup

---

## ✨ Features

### 1. 🤖 AI Tutor (Lumi)
- **Conversational Learning:** Chat with Lumi, your personal AI tutor
- **Clear Explanations:** Get concepts explained with analogies, examples, and bullet points
- **Markdown Support:** AI responses include formatted text, code blocks, and lists
- **Context-Aware:** Lumi remembers your conversation history (last 10 messages)
- **Instant Help:** Ask anything from "Explain recursion like I'm 10" to "How does photosynthesis work?"

**How It Works:**
- Powered by Mistral 7B Instruct (free tier via OpenRouter)
- System prompt defines Lumi's personality as a friendly, encouraging tutor
- Responses are limited to 800 tokens (~600 words) for conciseness
- Chat history persists in localStorage across sessions

---

### 2. 📚 AI Lesson Generator
- **Topic-Based Learning:** Enter any topic and get a structured lesson in seconds
- **Rich Formatting:** Lessons use markdown with headers, bold text, bullet points
- **Persistent Topics:** Your topics and lessons are saved for future reference
- **One-Click Flashcards:** Generate 6 flashcards from any lesson instantly
- **Regenerate:** Don't like the lesson? Regenerate it with one click

**How It Works:**
- AI generates 400-word lessons with key concepts, examples, and tips
- Lessons are cached in localStorage under the topic name
- Flashcard generation extracts Q&A pairs from the lesson content
- Uses JSON parsing with regex fallback for robust AI output handling

---

### 3. 🃏 Spaced Repetition Flashcards
- **SM-2 Algorithm:** Industry-standard spaced repetition (used by Anki, SuperMemo)
- **Kanban Board:** Visual organization into "Due Today", "Coming Up", "Mastered"
- **Review Mode:** Full-screen study session with flip animations
- **Easy/Hard Rating:** Simple two-button system (quality 5 or 2 in SM-2)
- **Deck Organization:** Group cards by topic/subject
- **Manual Creation:** Add custom cards with front/back + deck name

**How It Works:**
- Each card tracks: easeFactor (2.5 default), interval (days), repetitions (count)
- "Easy" (quality 5): Increases interval exponentially (1d → 6d → 15d → 37d...)
- "Hard" (quality 2): Resets interval to 1 day, keeps ease factor
- Cards are "mastered" after 3+ successful reviews with EF ≥ 2.3
- All scheduling data stored in localStorage as JSON

---

### 4. 📝 AI Quiz Generator
- **Instant Quizzes:** Generate 5 multiple-choice questions on any topic
- **Answer Checking:** Immediate feedback with correct/incorrect highlighting
- **AI Explanations:** Click "Explain this" on wrong answers for clarification
- **Quiz History:** Track all past quizzes with scores and dates
- **Results Page:** See your score, review wrong answers, and get explanations

**How It Works:**
- AI generates JSON array: `[{question, options, correct}]`
- Regex extraction handles cases where AI adds extra text around JSON
- Fallback quiz ensures the page never crashes on AI failures
- Quiz history stored in localStorage with full question data for review

---

### 5. 📊 Progress Tracking
- **Daily Streak:** Track consecutive days of study (like Duolingo)
- **Study Time:** Total minutes spent learning
- **Statistics Dashboard:** Cards created, quizzes taken, average score, decks
- **Visual Feedback:** Progress bars, streak stamps, score badges
- **Study Tips:** Random motivational tips on the dashboard

**How It Works:**
- Streak updates on first visit each day (checks lastDate vs today)
- Streak breaks if you miss a day (resets to 1)
- All stats derived from localStorage data (no separate analytics DB)

---

### 6. 🎨 Beautiful UI/UX
- **Paper Texture:** Subtle dot pattern backgrounds for a tactile feel
- **Playful Design:** Rotated cards, handwritten fonts, sticky notes
- **Responsive:** Works on mobile, tablet, and desktop
- **Smooth Animations:** Flashcard flips, typing indicators, hover effects
- **Accessible:** Semantic HTML, ARIA labels, keyboard navigation

**Design System:**
- **Colors:** Blue (#3b82f6), Orange (#f97316), Green (#22c55e), Slate (#64748b)
- **Fonts:** Inter (UI), Newsreader (serif), Caveat (handwriting)
- **Spacing:** 4px base unit (Tailwind's default)
- **Rounded Corners:** Varied radii (rounded-sm to rounded-2xl) for visual interest

---

### 7. 🔒 Privacy & Data Control
- **No Account Required:** Start using immediately, no sign-up
- **Local Storage Only:** All data stays in your browser
- **No Tracking:** No analytics, no cookies, no third-party scripts
- **Data Export:** Download all your data as JSON backup
- **Data Reset:** Nuclear option to clear everything and start fresh

**Data Stored:**
- `streak`: { count, lastDate, totalMinutes }
- `flashcards`: Array of card objects with SM-2 data
- `quizHistory`: Array of quiz results with questions
- `userTopics`: Object mapping topic names to lesson content
- `chatHistory`: Array of chat messages with timestamps
- `userSettings`: { name, dailyGoal }

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for development)
- Modern browser (Chrome, Firefox, Safari, Edge)
- OpenRouter API key (free tier available)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/lumilearn.git
   cd lumilearn
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the project root:
   ```env
   VITE_OPENROUTER_API_KEY=your_api_key_here
   VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
   ```

   **Get your API key:**
   - Sign up at [OpenRouter.ai](https://openrouter.ai/)
   - Navigate to Keys section
   - Create a new API key
   - The free tier includes Mistral 7B Instruct (the model LumiLearn uses)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

The build output goes to the `dist/` folder, ready for deployment to any static host (Vercel, Netlify, GitHub Pages, etc.).

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 19 + Vite 8
- **Routing:** React Router v7
- **Styling:** Tailwind CSS v4
- **AI:** OpenRouter API (Mistral 7B Instruct)
- **HTTP:** Axios
- **Markdown:** react-markdown + remark-gfm
- **Icons:** react-icons (Feather Icons + Remix Icons)
- **State:** React hooks + localStorage (no Redux/Context)

### Project Structure
```
lumilearn/
├── public/              # Static assets (favicon, icons)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── AIChatMessage.jsx       # Chat bubble with markdown
│   │   ├── BlueButton.jsx          # Primary action button
│   │   ├── Flashcard.jsx           # Flip animation card
│   │   ├── Footer.jsx              # App footer
│   │   ├── Header.jsx              # Navigation header
│   │   ├── OutlineButton.jsx       # Secondary button
│   │   ├── PaperCard.jsx           # Card container
│   │   ├── ProgressBar.jsx         # Progress indicator
│   │   ├── QuizCard.jsx            # Quiz question UI
│   │   ├── StickyNote.jsx          # Sticky note container
│   │   └── StreakDisplay.jsx       # Streak counter
│   ├── hooks/           # Custom React hooks
│   │   └── useLocalStorage.js      # Persistent state hook
│   ├── pages/           # Route components (one per URL)
│   │   ├── AIAssistant.jsx         # /ai — Chat with Lumi
│   │   ├── Dashboard.jsx           # /dashboard — Study overview
│   │   ├── Flashcards.jsx          # /flashcards — Spaced repetition
│   │   ├── LandingPage.jsx         # / — Home/marketing page
│   │   ├── Learn.jsx               # /learn — Lesson generator
│   │   ├── NotFound.jsx            # /* — 404 page
│   │   ├── Profile.jsx             # /profile — Settings & stats
│   │   └── Quiz.jsx                # /quiz — Quiz generator
│   ├── utils/           # Pure utility functions
│   │   ├── helpers.js              # General utilities
│   │   ├── openrouter.js           # AI API calls
│   │   └── spacedRepetition.js     # SM-2 algorithm
│   ├── App.jsx          # Root component (routing setup)
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles + Tailwind
├── .env                 # Environment variables (API keys)
├── index.html           # HTML entry point
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

### Data Flow
```
User Action
    ↓
React Component (useState)
    ↓
useLocalStorage hook
    ↓
localStorage (browser API)
    ↓
JSON serialization
    ↓
Persistent storage (survives page reload)
```

### AI Integration Flow
```
User Input (topic, question, etc.)
    ↓
Component calls AI function (openrouter.js)
    ↓
Build messages array with system + user prompts
    ↓
axios.post to OpenRouter API
    ↓
OpenRouter routes to Mistral 7B Instruct
    ↓
Parse response (text or JSON)
    ↓
Update component state
    ↓
Re-render UI with AI-generated content
```

---

## 🧠 How Spaced Repetition Works

LumiLearn uses the **SM-2 algorithm** (SuperMemo 2), developed by Piotr Wozniak in 1987. It's the same algorithm used by Anki, the most popular flashcard app.

### The Algorithm

Each card tracks three values:
- **easeFactor (EF):** How easy the card is for you (starts at 2.5, min 1.3)
- **interval:** Days until the next review
- **repetitions:** Successful recall count

### Quality Ratings (0-5)
- **0-1:** Complete blackout / totally wrong
- **2:** Wrong but the answer felt familiar
- **3:** Correct with significant difficulty
- **4:** Correct with some hesitation
- **5:** Perfect, instant recall

### Interval Schedule
- **First success:** Review in 1 day
- **Second success:** Review in 6 days
- **Subsequent:** interval = round(previous_interval × easeFactor)

### Example Timeline
```
Day 0:  Learn card (interval = 1)
Day 1:  Review → Easy (interval = 6)
Day 7:  Review → Easy (interval = 15)
Day 22: Review → Easy (interval = 37)
Day 59: Review → Easy (interval = 92)
...
```

If you rate a card "Hard" at any point, it resets to a 1-day interval.

### Why It Works
- **Spacing Effect:** Memories are stronger when learning is spread out
- **Desirable Difficulty:** Reviewing just before forgetting strengthens recall
- **Exponential Growth:** Intervals grow exponentially, so you review less over time
- **Personalized:** Each card's schedule adapts to YOUR memory of it

---

## 🎯 Use Cases

### For Students
- **Exam Prep:** Generate quizzes on any subject, review with flashcards
- **Language Learning:** Create vocab flashcards, practice with AI tutor
- **Concept Mastery:** Get clear explanations of difficult topics

### For Self-Learners
- **New Skills:** Learn programming, design, writing, etc. with AI lessons
- **Knowledge Retention:** Use spaced repetition to remember what you learn
- **Curiosity:** Ask Lumi anything and get instant, clear answers

### For Educators
- **Lesson Planning:** Generate lesson outlines on any topic
- **Quiz Creation:** Quickly create practice quizzes for students
- **Study Resources:** Export flashcard decks for students to use

---

## 🔧 Configuration

### Environment Variables
```env
# OpenRouter API Configuration
VITE_OPENROUTER_API_KEY=sk-or-v1-...
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
```

**Why VITE_ prefix?**
Vite only exposes environment variables prefixed with `VITE_` to the browser bundle. This prevents accidentally leaking server-side secrets.

### Changing the AI Model
Edit `src/utils/openrouter.js`:
```javascript
const AI_MODEL = 'mistralai/mistral-7b-instruct:free'; // Change this line
```

**Available free models on OpenRouter:**
- `mistralai/mistral-7b-instruct:free` (current)
- `google/gemma-7b-it:free`
- `meta-llama/llama-3-8b-instruct:free`

**Paid models (better quality):**
- `anthropic/claude-3-sonnet`
- `openai/gpt-4-turbo`
- `google/gemini-pro`

### Customizing the UI
- **Colors:** Edit Tailwind classes in components
- **Fonts:** Change `@import` in `src/index.css`
- **Layout:** Modify component JSX and Tailwind classes

---

## 🐛 Troubleshooting

### AI Features Not Working
**Symptom:** "AI is not configured" error or "Sorry, I had trouble responding"

**Causes:**
1. Missing or invalid API key in `.env`
2. API key not prefixed with `VITE_`
3. Forgot to restart dev server after changing `.env`
4. OpenRouter API is down (rare)

**Fix:**
```bash
# 1. Check your .env file
cat .env

# 2. Ensure it has VITE_ prefix
VITE_OPENROUTER_API_KEY=sk-or-v1-...

# 3. Restart the dev server
npm run dev
```

### Flashcards Not Saving
**Symptom:** Cards disappear on page reload

**Causes:**
1. Browser in private/incognito mode (localStorage disabled)
2. localStorage quota exceeded (rare, ~5-10MB limit)
3. Browser extension blocking localStorage

**Fix:**
- Use a normal browser window (not private)
- Clear old data: Profile → Reset Everything
- Disable browser extensions temporarily

### Build Warnings
**Symptom:** "Chunk size warning" during `npm run build`

**Cause:** Large bundle size (504 KB) due to dependencies

**Fix (optional):**
- Enable code-splitting in `vite.config.js`
- Lazy-load routes with `React.lazy()`
- Not critical — the app still works fine

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build
npm run build

# Deploy dist/ folder via Netlify UI or CLI
netlify deploy --prod --dir=dist
```

### GitHub Pages
```bash
# Install gh-pages
npm i -D gh-pages

# Add to package.json scripts:
"deploy": "vite build && gh-pages -d dist"

# Deploy
npm run deploy
```

**Important:** Add your API key as an environment variable in your hosting platform's dashboard (not in the `.env` file committed to git).

---

## 📈 Roadmap

### Planned Features
- [ ] **Import/Export Flashcards:** Anki-compatible CSV import
- [ ] **Collaborative Decks:** Share flashcard decks via URL
- [ ] **Audio Flashcards:** Text-to-speech for language learning
- [ ] **Image Occlusion:** Hide parts of images for visual learning
- [ ] **Study Sessions:** Timed Pomodoro-style study blocks
- [ ] **Gamification:** XP, levels, achievements
- [ ] **Mobile App:** React Native version
- [ ] **Offline Mode:** Service worker for full offline support
- [ ] **Multi-Language:** i18n support for non-English users
- [ ] **Advanced Stats:** Heatmaps, retention curves, forecast

### Potential Enhancements
- **Better AI Models:** Switch to GPT-4 or Claude for higher quality
- **Voice Input:** Speak your questions to Lumi
- **PDF Import:** Generate flashcards from uploaded PDFs
- **Collaborative Learning:** Study groups, shared quizzes
- **Spaced Repetition v2:** FSRS algorithm (more accurate than SM-2)

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Commit your changes:** `git commit -m 'Add amazing feature'`
4. **Push to the branch:** `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style (Prettier + ESLint)
- Add comments to complex logic
- Test on multiple browsers
- Keep bundle size in mind (avoid heavy dependencies)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

**TL;DR:** You can use, modify, and distribute this code freely, even commercially. Just keep the copyright notice.

---

## 🙏 Acknowledgments

- **OpenRouter:** For providing free-tier AI API access
- **Mistral AI:** For the excellent Mistral 7B Instruct model
- **Piotr Wozniak:** For inventing the SM-2 algorithm
- **Tailwind CSS:** For making styling actually enjoyable
- **React Team:** For the best UI library ever made
- **Vite:** For blazing-fast dev experience

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/lumilearn/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/lumilearn/discussions)
- **Email:** your.email@example.com

---

## 🌟 Star History

If you find LumiLearn useful, please consider giving it a star on GitHub! ⭐

---

**Made with ☕ and procrastination**

*LumiLearn — Learn smarter, not harder.*
