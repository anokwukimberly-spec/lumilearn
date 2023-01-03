/**
 * openrouter.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Central module for all AI API calls via OpenRouter.
 * OpenRouter is a unified API gateway that lets you call many LLM providers
 * (Mistral, OpenAI, Claude, etc.) through a single endpoint.
 *
 * HOW IT WORKS:
 *  1. We read the API key from Vite's environment variables (import.meta.env).
 *     Vite only exposes variables prefixed with VITE_ to the browser bundle.
 *  2. Every request is a POST to the OpenRouter chat completions endpoint.
 *  3. We use the free Mistral 7B Instruct model for all requests.
 *  4. Each exported function wraps askAI() with a specific system prompt
 *     and user prompt tailored to its purpose.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import axios from 'axios'; // axios: promise-based HTTP client for the browser

// ─── Environment Variables ────────────────────────────────────────────────────
// import.meta.env is Vite's way of accessing .env file variables at build time.
// Variables MUST be prefixed with VITE_ to be included in the browser bundle.
// Without this prefix, Vite strips them out for security reasons.
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = import.meta.env.VITE_OPENROUTER_API_URL;

// ─── Model Configuration ──────────────────────────────────────────────────────
// mistralai/mistral-7b-instruct:free is a free-tier model on OpenRouter.
// It's a 7-billion parameter instruction-tuned model — fast and capable enough
// for educational content generation.
// 'openrouter/auto' automatically routes to the best available free model.
// This avoids 404 errors when specific free models go offline.
const AI_MODEL = 'openrouter/auto';

// ─── Request Headers ─────────────────────────────────────────────────────────
/**
 * Builds the HTTP headers required by OpenRouter's API.
 * - Authorization: Bearer token authentication using our API key.
 * - Content-Type: We're sending JSON in the request body.
 * - HTTP-Referer: OpenRouter uses this to identify your app (required for free tier).
 * - X-Title: Human-readable app name shown in OpenRouter's dashboard.
 *
 * @returns {Object} Headers object for axios requests
 */
function getHeaders() {
  return {
    'Authorization': `Bearer ${API_KEY}`,       // API key as Bearer token
    'Content-Type': 'application/json',          // We're sending JSON
    'HTTP-Referer': window.location.origin,      // Your app's URL (e.g. http://localhost:5173)
    'X-Title': 'LumiLearn',                      // App name for OpenRouter dashboard
  };
}

// ─── Core AI Function ─────────────────────────────────────────────────────────
/**
 * askAI — The core function that sends a conversation to the AI and returns its reply.
 *
 * The OpenAI-compatible chat format uses an array of "messages", each with:
 *   - role: 'system' | 'user' | 'assistant'
 *   - content: the text of the message
 *
 * 'system' messages set the AI's behavior/persona.
 * 'user' messages are what the human says.
 * 'assistant' messages are previous AI replies (for multi-turn conversations).
 *
 * @param {Array<{role: string, content: string}>} messages - Conversation history
 * @returns {Promise<string>} The AI's text response, or an error message string
 */
export async function askAI(messages) {
  // Guard: if the API key is missing, fail fast with a clear error
  if (!API_KEY) {
    console.error('OpenRouter API key is missing. Check your .env file for VITE_OPENROUTER_API_KEY.');
    return 'AI is not configured. Please add your OpenRouter API key to the .env file.';
  }

  try {
    // POST request to OpenRouter's chat completions endpoint
    const response = await axios.post(
      API_URL,
      {
        model: AI_MODEL,       // Which LLM to use
        messages,              // The conversation array
        temperature: 0.7,      // Creativity level: 0 = deterministic, 1 = very creative
        max_tokens: 800,       // Maximum length of the AI's response (~600 words)
      },
      {
        headers: getHeaders(), // Auth + content-type headers
        timeout: 30000,        // 30-second timeout to prevent hanging requests
      }
    );

    // OpenRouter returns the same structure as OpenAI:
    // response.data.choices[0].message.content is the AI's reply text.
    // We use optional chaining (?.) to safely handle unexpected response shapes.
    const content = response.data?.choices?.[0]?.message?.content;

    // If the response exists but has no content, something went wrong on the API side
    if (!content) throw new Error('Empty response from AI');

    return content; // Return the AI's reply as a plain string

  } catch (error) {
    // Extract the most useful error message available:
    // - error.response?.data?.error?.message: OpenRouter's own error description
    // - error.message: axios/network error message
    const detail = error.response?.data?.error?.message || error.message;

    // Log full error details to the browser console for debugging
    console.error('OpenRouter API error:', detail, error.response?.data);

    // Return a user-friendly error string instead of throwing,
    // so the UI can display it gracefully without crashing
    return `Sorry, I had trouble responding. (${detail || 'Network error'}) — Please try again.`;
  }
}

// ─── Lesson Generation ────────────────────────────────────────────────────────
/**
 * generateLesson — Asks the AI to teach a topic in a structured, readable way.
 *
 * Uses markdown formatting so the output can be rendered with ReactMarkdown.
 * The system prompt instructs the AI to act as an expert tutor.
 *
 * @param {string} topic - The subject to generate a lesson about
 * @returns {Promise<string>} Markdown-formatted lesson content
 */
export async function generateLesson(topic) {
  return askAI([
    {
      role: 'system',
      // System prompt: defines the AI's role and output format for this request
      content: 'You are an expert tutor. Explain topics clearly with examples, bullet points, and analogies. Use markdown formatting with headers, bold text, and lists.',
    },
    {
      role: 'user',
      // User prompt: specific instruction with the topic variable injected
      content: `Teach me about "${topic}" in a clear, engaging way. Include key concepts, examples, and 2-3 quick tips. Keep it under 400 words.`,
    },
  ]);
}

// ─── Quiz Generation ──────────────────────────────────────────────────────────
/**
 * generateQuiz — Generates multiple-choice quiz questions as a JSON array.
 *
 * The AI is instructed to return ONLY raw JSON (no markdown fences, no explanation)
 * so we can parse it directly. We use a regex fallback to extract JSON even if
 * the AI wraps it in extra text.
 *
 * Expected JSON shape:
 * [{ "question": "...", "options": ["A","B","C","D"], "correct": 0 }]
 * where "correct" is the 0-based index of the right answer.
 *
 * @param {string} topic - The subject to quiz about
 * @param {number} numQuestions - How many questions to generate (default: 5)
 * @returns {Promise<Array>} Array of question objects, or a fallback quiz on failure
 */
export async function generateQuiz(topic, numQuestions = 5) {
  // Explicit JSON format instruction in the prompt reduces parsing failures
  const prompt = `Generate ${numQuestions} multiple choice questions about "${topic}".
Return ONLY a valid JSON array — no markdown, no explanation, no code fences:
[{"question":"...","options":["A","B","C","D"],"correct":0}]
The "correct" field must be the index (0-3) of the right answer in the options array.`;

  // Get the raw AI response string
  const response = await askAI([
    {
      role: 'system',
      // Strict instruction: output ONLY JSON, nothing else
      content: 'You are a quiz generator. Output ONLY a valid raw JSON array. No markdown fences. No explanation before or after.',
    },
    { role: 'user', content: prompt },
  ]);

  // Check if the response itself is an error message (starts with "Sorry")
  if (response.startsWith('Sorry,') || response.startsWith('AI is not')) {
    console.warn('Quiz generation failed, using fallback:', response);
    return fallbackQuiz(topic);
  }

  try {
    // Regex to extract the first JSON array from the response.
    // [\s\S]* matches any character including newlines (greedy).
    // This handles cases where the AI adds text before/after the JSON.
    const jsonMatch = response.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]); // Parse the extracted JSON string

      // Validate the parsed result is a non-empty array of question objects
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].question) {
        // Clamp the "correct" index to valid bounds (0 to options.length-1)
        // This prevents crashes if the AI returns an out-of-range index
        return parsed.map(q => ({
          ...q,
          correct: Math.max(0, Math.min(q.correct ?? 0, (q.options?.length ?? 4) - 1)),
        }));
      }
    }

    // If JSON extraction or validation failed, use the fallback
    return fallbackQuiz(topic);
  } catch (parseError) {
    // JSON.parse threw — the AI returned malformed JSON
    console.error('Quiz JSON parse error:', parseError, 'Raw response:', response);
    return fallbackQuiz(topic);
  }
}

// ─── Wrong Answer Explanation ─────────────────────────────────────────────────
/**
 * explainWrongAnswer — Asks the AI to explain why a quiz answer was wrong.
 *
 * Called when a user clicks "Explain this" on a wrong answer in the results page.
 * Keeps explanations brief (2-3 sentences) to avoid overwhelming the user.
 *
 * @param {string} question - The quiz question text
 * @param {string} userAnswer - The option text the user selected
 * @param {string} correctAnswer - The option text of the correct answer
 * @returns {Promise<string>} A brief explanation of the correct answer
 */
export async function explainWrongAnswer(question, userAnswer, correctAnswer) {
  return askAI([
    {
      role: 'system',
      content: 'You are a helpful tutor. Explain quiz answers briefly and clearly. 2-3 sentences max.',
    },
    {
      role: 'user',
      // Provide full context: the question, what the student chose, and the right answer
      content: `Question: "${question}"\nStudent answered: "${userAnswer}"\nCorrect answer: "${correctAnswer}"\nExplain why the correct answer is right in 2-3 sentences.`,
    },
  ]);
}

// ─── Flashcard Generation ─────────────────────────────────────────────────────
/**
 * generateFlashcardsFromTopic — Generates study flashcards as a JSON array.
 *
 * Similar to generateQuiz, the AI returns raw JSON that we parse.
 * Each flashcard has a "front" (question/term) and "back" (answer/definition).
 *
 * Expected JSON shape:
 * [{ "front": "What is X?", "back": "X is..." }]
 *
 * @param {string} topic - The subject to create flashcards for
 * @returns {Promise<Array<{front: string, back: string}>>} Array of card objects, or [] on failure
 */
export async function generateFlashcardsFromTopic(topic) {
  const prompt = `Generate 6 flashcards for studying "${topic}".
Return ONLY a valid JSON array — no markdown, no explanation:
[{"front":"question or term","back":"answer or definition"}]
Make the fronts concise questions or terms. Make the backs clear, complete answers.`;

  // Get the raw AI response string
  const response = await askAI([
    {
      role: 'system',
      content: 'You are a flashcard generator. Output ONLY a valid raw JSON array. No markdown. No extra text.',
    },
    { role: 'user', content: prompt },
  ]);

  // If the AI returned an error message, return empty array with a log
  if (response.startsWith('Sorry,') || response.startsWith('AI is not')) {
    console.warn('Flashcard generation failed:', response);
    return [];
  }

  try {
    // Extract the JSON array from the response using regex
    const jsonMatch = response.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]); // Parse the JSON string

      // Validate: must be an array of objects with front and back strings
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].front && parsed[0].back) {
        return parsed; // Return the valid flashcard array
      }
    }

    // JSON didn't match expected shape
    return [];
  } catch (parseError) {
    // JSON.parse threw — malformed response from AI
    console.error('Flashcard JSON parse error:', parseError, 'Raw response:', response);
    return [];
  }
}

// ─── Fallback Quiz ────────────────────────────────────────────────────────────
/**
 * fallbackQuiz — Returns a single generic question when AI quiz generation fails.
 *
 * This ensures the Quiz page never crashes or shows a blank state even when
 * the AI is unavailable or returns unparseable output.
 *
 * @param {string} topic - The topic that was requested (used in the question text)
 * @returns {Array} A single-question quiz array
 */
function fallbackQuiz(topic) {
  return [
    {
      question: `What is the main concept behind "${topic}"?`,
      options: [
        'A fundamental principle or idea',
        'An advanced mathematical technique',
        'A historical event from the 20th century',
        'A type of chemical formula',
      ],
      correct: 0, // The first option is the "correct" answer for the fallback
    },
  ];
}