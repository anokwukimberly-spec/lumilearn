import { useState } from 'react';
import { FiThumbsUp, FiThumbsDown, FiRotateCcw } from 'react-icons/fi';

export default function FlashcardComponent({ card, onEasy, onHard, showActions = true }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped(!flipped);

  const handleEasy = (e) => {
    e.stopPropagation();
    setFlipped(false);
    setTimeout(() => onEasy && onEasy(card), 100);
  };

  const handleHard = (e) => {
    e.stopPropagation();
    setFlipped(false);
    setTimeout(() => onHard && onHard(card), 100);
  };

  return (
    <div className="flashcard-scene w-full" style={{ height: '180px' }}>
      <div
        style={{
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.45s',
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
        onClick={handleFlip}
        className="cursor-pointer"
      >
        {/* Front */}
        <div
          className="absolute w-full h-full bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center font-semibold text-slate-800 text-base leading-snug">
              {card.front}
            </p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400 font-hand text-base">{card.deck || 'General'}</span>
            <span className="flex items-center gap-1 text-xs text-blue-400">
              <FiRotateCcw size={11} /> tap to flip
            </span>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col justify-between"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-slate-700 text-sm leading-relaxed">
              {card.back}
            </p>
          </div>
          {showActions && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleHard}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-red-50 border border-red-200 text-red-600 rounded-md hover:bg-red-100 cursor-pointer"
              >
                <FiThumbsDown size={12} /> Hard
              </button>
              <button
                onClick={handleEasy}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold bg-green-50 border border-green-200 text-green-700 rounded-md hover:bg-green-100 cursor-pointer"
              >
                <FiThumbsUp size={12} /> Easy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
