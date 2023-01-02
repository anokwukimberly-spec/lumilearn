import { FiZap, FiCircle } from 'react-icons/fi';
import { RiFireFill } from 'react-icons/ri';

export default function StreakDisplay({ count = 0, totalMinutes = 0, size = 'md' }) {
  const stamps = Array.from({ length: Math.max(10, count) }, (_, i) => i < count);

  return (
    <div>
      {size === 'lg' ? (
        <div className="flex items-center gap-3 mb-3">
          <RiFireFill size={36} className="text-orange-500" />
          <div>
            <p className="text-3xl font-black text-orange-600">{count}</p>
            <p className="text-sm text-slate-500 font-medium">day streak</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 mb-2">
          <RiFireFill size={24} className="text-orange-500" />
          <div>
            <span className="text-xl font-black text-orange-600">{count}</span>
            <span className="text-sm text-slate-500 ml-1">day streak</span>
          </div>
        </div>
      )}

      {/* Coffee stamp card */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {stamps.slice(0, 10).map((active, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center
              ${active
                ? 'border-orange-400 bg-orange-100 text-orange-500'
                : 'border-slate-200 bg-slate-50 text-slate-300'
              }`}
          >
            {active
              ? <FiZap size={12} className="fill-orange-400 text-orange-500" />
              : <FiCircle size={10} />
            }
          </div>
        ))}
      </div>

      {totalMinutes > 0 && (
        <p className="text-xs text-slate-400 mt-2">
          {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m total study time
        </p>
      )}
    </div>
  );
}
