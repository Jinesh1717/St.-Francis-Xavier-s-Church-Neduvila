import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-20 h-20 rounded-full bg-skyblue-100 text-gold-600 flex items-center justify-center font-bold text-3xl mb-6 shadow-soft">
        ✝
      </div>
      <h1 className="text-6xl font-heading font-bold text-slate-900 tracking-tight">404</h1>
      <h2 className="text-2xl font-heading font-semibold text-slate-800 mt-2">
        Page Not Found
      </h2>
      <p className="font-ml text-slate-500 mt-1">പേജ് കണ്ടെത്താൻ കഴിഞ്ഞില്ല</p>
      <p className="text-slate-600 max-w-md mt-4 text-sm sm:text-base leading-relaxed">
        The page you are looking for does not exist or has been moved. May peace be upon your journey.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-medium shadow-md transition-all"
        >
          <Home className="w-4 h-4 mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

