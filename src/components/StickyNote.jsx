export default function StickyNote({ children, className = '', rotate = '-1' }) {
  const rotations = {
    '-1': 'rotate-neg-one',
    '1': 'rotate-one',
    '0': '',
  };

  return (
    <div
      className={`
        bg-amber-50 border border-amber-200
        p-4 rounded-sm
        ${rotations[rotate] || 'rotate-neg-one'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
