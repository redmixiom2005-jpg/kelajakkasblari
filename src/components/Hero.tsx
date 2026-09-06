import React from 'react';
import { Compass, BookOpen, Sparkles, Award, Brain, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface HeroProps {
  onStartTest: () => void;
  onBrowseCareers: () => void;
  language: Language;
}

export const Hero: React.FC<HeroProps> = ({ onStartTest, onBrowseCareers, language }) => {
  const t = translations[language];

  const domains = [
    { label: "Axborot Texnologiyalari (IT)", color: "border-blue-500/40 bg-blue-500/10 text-blue-300" },
    { label: "Tibbiyot & Sog'liqni Saqlash", color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" },
    { label: "Muhandislik & Qurilish", color: "border-amber-500/40 bg-amber-500/10 text-amber-300" },
    { label: "Ijtimoiy Soha & Ta'lim", color: "border-purple-500/40 bg-purple-500/10 text-purple-300" },
    { label: "Ijodkorlik & Dizayn", color: "border-pink-500/40 bg-pink-500/10 text-pink-300" },
    { label: "Biznes & Moliya", color: "border-indigo-500/40 bg-indigo-500/10 text-indigo-300" },
    { label: "Qishloq Xo'jaligi & Tabiat", color: "border-lime-500/40 bg-lime-500/10 text-lime-300" },
    { label: "Huquq & Xavfsizlik", color: "border-rose-500/40 bg-rose-500/10 text-rose-300" }
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-teal-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* School badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            Namangan viloyati, Uychi tumani, 41-maktab
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 border border-teal-500/30 text-teal-300">
            <Brain className="w-3.5 h-3.5 text-teal-400" />
            Gemini 3.1 Pro High Thinking
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300">
            <Target className="w-3.5 h-3.5 text-blue-400" />
            Holland RIASEC Modeli
          </span>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {t.heroHeadline}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t.heroDescription}
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStartTest}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Compass className="w-5 h-5 text-slate-950" />
              <span>{t.startAssessment}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <button
              onClick={onBrowseCareers}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 text-white font-semibold text-base border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2.5 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-teal-400" />
              <span>{t.browseCareers}</span>
            </button>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">40 ta Diagnostik Savol</div>
            <div className="mt-1 text-xs text-slate-400 leading-relaxed">
              O‘quvchining mantiqiy, amaliy va ijtimoiy qiziqishlarini to‘liq qamrab oluvchi 5 ballik Likert tizimi.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">200+ Kasblar Atlasi</div>
            <div className="mt-1 text-xs text-slate-400 leading-relaxed">
              IT, tibbiyot, sanoat, ta'lim, agrosanoat va zamonaviy xizmat sohalarining to‘liq xaritasi.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
              <Brain className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">Gemini 3.1 Pro Tahlili</div>
            <div className="mt-1 text-xs text-slate-400 leading-relaxed">
              Yuqori fikrlash (Thinking Mode) orqali individual 3 yillik maktab va oliygohga tayyorgarlik rejasi.
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-xl font-bold text-white">Rasmiy Kasbiy Pasport</div>
            <div className="mt-1 text-xs text-slate-400 leading-relaxed">
              41-maktab psixologi muhri va ota-onalar uchun individual tavsiyalar bilan PDF chop etish.
            </div>
          </div>
        </div>

        {/* 8 Dimension Pills */}
        <div className="mt-12 text-center">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">
            Baholanadigan 8 asosiy kasbiy yo‘nalish
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {domains.map((d, i) => (
              <span
                key={i}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${d.color}`}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
