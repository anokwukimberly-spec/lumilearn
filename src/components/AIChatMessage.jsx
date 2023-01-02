import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiCpu, FiUser } from 'react-icons/fi';

export default function AIChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
          <FiCpu size={14} className="text-blue-600" />
        </div>
      )}

      <div
        className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-sm'
            : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="leading-relaxed">{message.content}</p>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        {message.timestamp && (
          <p className={`text-xs mt-1.5 ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center ml-2 mt-0.5 flex-shrink-0">
          <FiUser size={13} className="text-white" />
        </div>
      )}
    </div>
  );
}
