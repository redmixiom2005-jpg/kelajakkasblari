import React, { useState } from 'react';
import { ShieldCheck, X, AlertCircle, Loader2, KeyRound, User } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface LoginModalProps {
  language: Language;
  onClose: () => void;
  onLoginSuccess: (user: any, token: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ language, onClose, onLoginSuccess }) => {
  const t = translations[language];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Login va parolni kiriting');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() })
      });

      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.token) {
          localStorage.setItem('kasbim_token', data.token);
          localStorage.setItem('kasbim_admin_user', JSON.stringify(data.user));
          onLoginSuccess(data.user, data.token);
          onClose();
          return;
        } else {
          setErrorMsg(data.error || 'Login yoki parol noto‘g‘ri');
          return;
        }
      }
      throw new Error('Static/offline fallback');
    } catch (err: any) {
      // Offline / Static deployment verification for 41-maktab demo accounts
      const u = username.trim().toLowerCase();
      const p = password.trim();

      if (u === 'admin' && p === 'admin41!') {
        const adminUser = {
          id: 'usr-admin-local',
          username: 'admin',
          fullName: 'Maktab Ma\'muri (Admin)',
          role: 'ADMIN'
        };
        const token = 'local-admin-token-' + Date.now();
        localStorage.setItem('kasbim_token', token);
        localStorage.setItem('kasbim_admin_user', JSON.stringify(adminUser));
        onLoginSuccess(adminUser, token);
        onClose();
      } else if (u === 'pedagog' && p === 'ustoz41!') {
        const teacherUser = {
          id: 'usr-teacher-local',
          username: 'pedagog',
          fullName: 'Maktab Amaliyotchi Psixologi',
          role: 'TEACHER'
        };
        const token = 'local-teacher-token-' + Date.now();
        localStorage.setItem('kasbim_token', token);
        localStorage.setItem('kasbim_admin_user', JSON.stringify(teacherUser));
        onLoginSuccess(teacherUser, token);
        onClose();
      } else {
        setErrorMsg('Login yoki parol noto‘g‘ri. Namuna: admin / admin41! yoki pedagog / ustoz41!');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t.adminLogin}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            41-maktab o‘qituvchi va psixologlar boshqaruv paneli
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.username}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin yoki pedagog"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t.password}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Tekshirilmoqda...</span>
              </>
            ) : (
              <span>{t.loginButton}</span>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 mb-2 font-medium">Tezkor namunaviy hisoblar:</div>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fillQuickDemo('admin', 'admin41!')}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-mono transition-colors"
            >
              admin / admin41!
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('pedagog', 'ustoz41!')}
              className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 font-mono transition-colors"
            >
              pedagog / ustoz41!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
