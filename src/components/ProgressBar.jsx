export default function ProgressBar({ value = 0, max = 100, label = '', color = 'blue' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    orange: 'bg-orange-400',
    cyan: 'bg-cyan-500',
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-500">{label}</span>
          <span className="text-xs font-semibold text-slate-600">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2 border border-slate-200">
        <div
          className={`h-2 rounded-full ${colors[color] || colors.blue}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
