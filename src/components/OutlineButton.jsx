export default function OutlineButton({ children, onClick, type = 'button', disabled = false, className = '', size = 'md' }) {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizes[size]}
        bg-transparent hover:bg-blue-50 text-blue-700 font-semibold
        rounded-md border-2 border-blue-400 hover:border-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
}
