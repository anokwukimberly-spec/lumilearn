import { FiCheck, FiX } from 'react-icons/fi';

export default function QuizCard({ question, options, selectedIndex, onSelect, showAnswer = false, correctIndex }) {
  const getOptionStyle = (index) => {
    if (!showAnswer) {
      return selectedIndex === index
        ? 'border-blue-400 bg-blue-50 text-blue-800'
        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50';
    }
    if (index === correctIndex) return 'border-green-400 bg-green-50 text-green-800';
    if (index === selectedIndex && index !== correctIndex) return 'border-red-300 bg-red-50 text-red-700';
    return 'border-slate-200 bg-white text-slate-400';
  };

  return (
    <div>
      <p className="font-semibold text-slate-800 text-base mb-5 leading-snug">{question}</p>
      <div className="flex flex-col gap-2.5">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => !showAnswer && onSelect(i)}
            disabled={showAnswer}
            className={`text-left w-full px-4 py-3 rounded-lg border-2 text-sm font-medium cursor-pointer disabled:cursor-default flex items-center justify-between gap-3 ${getOptionStyle(i)}`}
          >
            <span>
              <span className="font-bold mr-2 text-slate-400">{String.fromCharCode(65 + i)}.</span>
              {option}
            </span>
            {showAnswer && i === correctIndex && <FiCheck size={15} className="text-green-600 flex-shrink-0" />}
            {showAnswer && i === selectedIndex && i !== correctIndex && <FiX size={15} className="text-red-500 flex-shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
}
