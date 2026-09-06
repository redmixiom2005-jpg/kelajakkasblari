import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TestStepper } from './components/TestStepper';
import { ResultPassport } from './components/ResultPassport';
import { CareerAtlas } from './components/CareerAtlas';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutSchool } from './components/AboutSchool';
import { LoginModal } from './components/LoginModal';
import { Language, TestResult } from './types';
import { translations } from './i18n';
import { GraduationCap, Heart, Compass, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('uz');
  const [activeResult, setActiveResult] = useState<TestResult | null>(null);

  // Admin / Teacher Auth
  const [adminUser, setAdminUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Check saved session
    try {
      const savedToken = localStorage.getItem('kasbim_token');
      const savedUser = localStorage.getItem('kasbim_admin_user');
      if (savedToken && savedUser) {
        setToken(savedToken);
        setAdminUser(JSON.parse(savedUser));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kasbim_token');
    localStorage.removeItem('kasbim_admin_user');
    setToken(null);
    setAdminUser(null);
    if (currentView === 'admin') {
      setCurrentView('home');
    }
  };

  const handleTestComplete = (result: TestResult) => {
    setActiveResult(result);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewStudentResult = (result: TestResult) => {
    setActiveResult(result);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        language={language}
        setLanguage={setLanguage}
        adminUser={adminUser}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero
              language={language}
              onStartTest={() => {
                setCurrentView('test');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBrowseCareers={() => {
                setCurrentView('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            {/* Embedded Career Atlas Preview */}
            <div className="border-t border-slate-800">
              <CareerAtlas language={language} />
            </div>
          </>
        )}

        {currentView === 'test' && (
          <TestStepper
            language={language}
            onTestComplete={handleTestComplete}
            onCancel={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'result' && activeResult && (
          <ResultPassport
            result={activeResult}
            language={language}
            onRetake={() => {
              setCurrentView('test');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreCareers={() => {
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'catalog' && (
          <CareerAtlas language={language} />
        )}

        {currentView === 'about' && (
          <AboutSchool
            language={language}
            onStartTest={() => {
              setCurrentView('test');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'admin' && (
          token ? (
            <AdminDashboard
              language={language}
              token={token}
              adminUser={adminUser}
              onViewStudentResult={handleViewStudentResult}
            />
          ) : (
            <div className="max-w-md mx-auto py-20 px-4 text-center">
              <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Boshqaruv paneliga kirish</h2>
              <p className="text-xs text-slate-400 mb-6">
                Ushbu bo‘lim faqat 41-maktab o‘qituvchilari va ma'murlari uchun mo‘ljallangan.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md"
              >
                Kirish oynasini ochish
              </button>
            </div>
          )
        )}
      </main>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginModal
          language={language}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(user, tok) => {
            setAdminUser(user);
            setToken(tok);
            setCurrentView('admin');
          }}
        />
      )}

      {/* School Footer (hidden when printing) */}
      <footer className="no-print bg-slate-900 border-t border-slate-800 text-xs text-slate-400 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-white text-sm">
                  {t.schoolTitle}
                </div>
                <div className="text-slate-400 text-xs">
                  {t.appTitle} — Kasbiy qiziqishlarni aniqlash va yo‘naltirish milliy platformasi
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => setCurrentView('home')} className="hover:text-emerald-400 transition-colors">
                {t.home}
              </button>
              <button onClick={() => setCurrentView('test')} className="hover:text-emerald-400 transition-colors">
                {t.takeTest}
              </button>
              <button onClick={() => setCurrentView('catalog')} className="hover:text-emerald-400 transition-colors">
                {t.careersCatalog}
              </button>
              <button onClick={() => setCurrentView('about')} className="hover:text-emerald-400 transition-colors">
                {t.aboutPlatform}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 Namangan viloyati, Uychi tumani, 41-maktab. Barcha huquqlar himoyalangan.
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span>Sun'iy intellekt: Gemini 3.1 Pro (High Thinking)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
