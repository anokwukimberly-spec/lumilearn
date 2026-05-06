/**
 * AIChatMessage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a single message bubble in the AI chat interface.
 *
 * LAYOUT:
 *  - User messages: right-aligned, blue background, user avatar on the right
 *  - AI messages: left-aligned, white background, CPU icon on the left
 *
 * MARKDOWN:
 *  AI responses are rendered with ReactMarkdown + remark-gfm so the AI can
 *  use bold text, bullet lists, code blocks, tables, etc. in its replies.
 *  User messages are rendered as plain text (no markdown processing needed).
 *
 * PROPS:
 *  message: { role: 'user'|'assistant', content: string, timestamp: string }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import ReactMarkdown from 'react-markdown'; // Renders markdown strings as React elements
import remarkGfm from 'remark-gfm';         // GitHub Flavored Markdown: tables, strikethrough, etc.
import { FiCpu, FiUser } from 'react-icons/fi'; // Icons for AI and user avatars

/**
 * AIChatMessage — Renders one chat bubble with appropriate styling for its role.
 *
 * @param {Object} props
 * @param {Object} props.message - Message object with role, content, and optional timestamp
 */
export default function AIChatMessage({ message }) {
  // Determine if this message is from the user (true) or the AI (false)
  const isUser = message.role === 'user';

  return (
    // Outer row: flex container that aligns the bubble left or right
    // justify-end pushes user messages to the right side
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>

      {/* AI avatar — only shown for AI messages, on the left side */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
          <FiCpu size={14} className="text-blue-600" />
        </div>
      )}

      {/* Message bubble */}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-sm'           // User: blue, rounded except bottom-right
            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm' // AI: white, rounded except bottom-left
        }`}
      >
        {isUser ? (
          // User messages: plain text, no markdown processing
          <p className="leading-relaxed">{message.content}</p>
        ) : (
          // AI messages: render as markdown for rich formatting
          // The markdown-content class applies custom styles from index.css
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Timestamp — shown below the message content if available */}
        {message.timestamp && (
          <p className={`text-xs mt-1.5 ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
            {/* Format the ISO timestamp as "HH:MM" using the browser's locale */}
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {/* User avatar — only shown for user messages, on the right side */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center ml-2 mt-0.5 flex-shrink-0">
          <FiUser size={13} className="text-white" />
        </div>
      )}
    </div>
  );
}
