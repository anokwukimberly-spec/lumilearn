import { FiCoffee } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <span className="text-xl font-black tracking-tight text-blue-800">LumiLearn</span>
          <p className="text-sm text-slate-400 mt-0.5 font-hand text-lg leading-none flex items-center gap-1">
            Made with <FiCoffee size={14} className="inline text-amber-500" /> and procrastination
          </p>
        </div>
        <div className="flex flex-col sm:items-end gap-1">
          <p className="text-xs text-slate-400">All data stored locally in your browser · No account needed</p>
          <p className="text-xs text-slate-300">Powered by OpenRouter · Mistral 7B</p>
        </div>
      </div>
    </footer>
  );
}
