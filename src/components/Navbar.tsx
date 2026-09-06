import React from 'react';
import { Compass, GraduationCap, BookOpen, ShieldCheck, UserCheck, Globe, LogOut } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  adminUser: any;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  language,
  setLanguage,
  adminUser,
  onLogout,
  onOpenLogin
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      {/* School Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900/70 via-teal-900/70 to-blue-900/70 py-1 px-4 border-b border-emerald-500/20 text-xs text-center text-emerald-200 font-medium tracking-wide flex items-center justify-center gap-2">
        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
        <span>{t.schoolTitle}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <button
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>{t.appTitle}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-semibold">
                41-maktab
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium line-clamp-1">
              {t.appSubtitle}
            </div>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => setCurrentView('home')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              currentView === 'home'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => setCurrentView('test')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'test'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>{t.takeTest}</span>
          </button>
          <button
            onClick={() => setCurrentView('catalog')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'catalog'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>{t.careersCatalog}</span>
          </button>
          <button
            onClick={() => setCurrentView('about')}
            className={`px-3 py-2 rounded-lg transition-colors ${
              currentView === 'about'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            {t.aboutPlatform}
          </button>
        </nav>

        {/* Right side controls: Language & Admin */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-slate-200 text-xs py-1.5 pl-1.5 pr-2 focus:outline-none cursor-pointer"
            >
              <option value="uz" className="bg-slate-800 text-white">O‘zbek (Lotin)</option>
              <option value="krill" className="bg-slate-800 text-white">Ўзбек (Кирилл)</option>
              <option value="ru" className="bg-slate-800 text-white">Русский</option>
              <option value="en" className="bg-slate-800 text-white">English</option>
            </select>
          </div>

          {/* Admin / Teacher Button */}
          {adminUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('admin')}
                className="flex items-center gap-1.5 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">{adminUser.fullName || 'Admin'}</span>
              </button>
              <button
                onClick={onLogout}
                title={t.logout}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{t.adminLogin}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
