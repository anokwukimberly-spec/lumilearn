export default function PaperCard({ children, className = '', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`
        bg-white border border-slate-200
        ${rounded}
        card-hover
        ${className}
      `}
    >
      {children}
    </div>
  );
}
