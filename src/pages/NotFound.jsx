import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
      <div className="text-center px-5 max-w-md">

        {/* Big 404 */}
        <div style={{ transform: 'rotate(-1deg)', display: 'inline-block' }}>
          <FiAlertCircle size={72} className="text-blue-200 mx-auto mb-4" />
        </div>

        <h1 className="text-8xl font-black text-blue-800 mb-2" style={{ transform: 'rotate(-0.5deg)', display: 'block' }}>
          404
        </h1>

        <p className="font-hand text-3xl text-slate-500 mb-2 mt-3">
          You wandered off the learning path.
        </p>
        <p className="text-sm text-slate-400 mb-7">
          This page doesn't exist. Maybe you should study it?
        </p>

        <Link to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md text-sm cursor-pointer">
          <FiHome size={14} /> Go Back Home
        </Link>

        <p className="font-hand text-xl text-slate-300 mt-10">
          (at least you found a 404 page, that's something)
        </p>
      </div>
    </div>
  );
}
