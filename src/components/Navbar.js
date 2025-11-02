// src/components/Navbar.js
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 p-4 shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link to="/" className="text-2xl sm:text-3xl font-extrabold text-white hover:text-cyan-300 transition">
          FinTech Revolution
        </Link>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm sm:text-base">
          <Link to="/" className="text-white hover:text-cyan-300 font-semibold transition">
            Market Stats
          </Link>
          <Link to="/portfolio" className="text-white hover:text-cyan-300 font-semibold transition">
            Portfolio
          </Link>
          <Link to="/watchlist" className="text-white/70 hover:text-cyan-300 font-semibold transition">
            Watchlist
          </Link>
          <Link to="/predictor" className="text-white/70 hover:text-cyan-300 font-semibold transition">
            AI Predictor
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;