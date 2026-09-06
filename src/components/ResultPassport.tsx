import React, { useState } from 'react';
import {
  Award,
  Compass,
  Printer,
  Sparkles,
  Brain,
  BookOpen,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Send,
  Loader2,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { TestResult, Language, Career } from '../types';
import { translations } from '../i18n';

import { askAiCounselor } from '../services/assessmentService';

interface ResultPassportProps {
  result: TestResult;
  language: Language;
  onRetake: () => void;
  onExploreCareers: () => void;
}

export const ResultPassport: React.FC<ResultPassportProps> = ({
  result,
  language,
  onRetake,
  onExploreCareers
}) => {
  const t = translations[language];

  // Currently selected career for roadmap viewing
  const [selectedCareer, setSelectedCareer] = useState<Career>(
    result.matchedCareers[0]?.career
  );

  // High thinking interactive question state
  const [customQuestion, setCustomQuestion] = useState('');
  const [aiThinkingLoading, setAiThinkingLoading] = useState(false);
  const [aiAnalysisText, setAiAnalysisText] = useState(result.aiAnalysis || '');
  const [strategicSteps, setStrategicSteps] = useState<string[]>(
    result.strategicSteps || []
  );

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || aiThinkingLoading) return;

    setAiThinkingLoading(true);
    try {
      const res = await fetch('/api/ai/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId: result.id,
          customQuestion: customQuestion.trim()
        })
      });
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.report) {
          setAiAnalysisText(data.report.analysisText);
          if (data.report.strategicSteps) {
            setStrategicSteps(data.report.strategicSteps);
          }
          setCustomQuestion('');
          return;
        }
      }
      throw new Error('Fallback to local counselor');
    } catch (err) {
      const fallbackAns = await askAiCounselor(result, customQuestion.trim());
      setAiAnalysisText(prev => prev + '\n\n---\n**Qo‘shimcha tahlil:**\n' + fallbackAns);
      setCustomQuestion('');
    } finally {
      setAiThinkingLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const dimensionItems = [
    { label: 'Axborot Texnologiyalari (IT)', val: result.dimensions.tech, color: 'from-blue-500 to-indigo-500' },
    { label: 'Tibbiyot & Salomatlik', val: result.dimensions.med, color: 'from-emerald-500 to-teal-500' },
    { label: 'Muhandislik & Konstruksiya', val: result.dimensions.eng, color: 'from-amber-500 to-orange-500' },
    { label: 'Ijtimoiy Soha & Ta\'lim', val: result.dimensions.soc, color: 'from-purple-500 to-pink-500' },
    { label: 'Ijodkorlik & Dizayn', val: result.dimensions.cre, color: 'from-pink-500 to-rose-500' },
    { label: 'Biznes & Moliya', val: result.dimensions.bus, color: 'from-cyan-500 to-blue-500' },
    { label: 'Tabiat & Qishloq Xo\'jaligi', val: result.dimensions.nat, color: 'from-lime-500 to-emerald-500' },
    { label: 'Huquq & Xavfsizlik', val: result.dimensions.law, color: 'from-rose-500 to-red-500' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold text-emerald-400">
            Diagnostika muvaffaqiyatli yakunlandi!
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>{t.printPassport}</span>
          </button>
          <button
            onClick={onRetake}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition-colors"
          >
            Qaytadan topshirish
          </button>
        </div>
      </div>

      {/* Official Certificate Document Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative print:border-none print:shadow-none print:p-2 print:bg-white print:text-black">
        {/* Decorative corner watermarks */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none print:hidden" />

        {/* School Header */}
        <div className="border-b border-slate-800 pb-6 mb-8 text-center print:border-black/20">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 print:bg-emerald-600 print:text-white">
              <Compass className="w-7 h-7" />
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold print:text-emerald-800">
                O‘zbekiston Respublikasi Xalq Ta'limi
              </div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight print:text-black">
                {t.schoolTitle}
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-3 print:text-black">
            {t.resultsTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 print:text-slate-600">
            {t.resultsSubtitle} • Guvohnoma ID: <span className="font-mono text-emerald-400 print:text-emerald-800">{result.id}</span>
          </p>
        </div>

        {/* Student Personal Details Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-8 text-xs print:bg-slate-100 print:text-black print:border-slate-300">
          <div>
            <div className="text-slate-400 uppercase tracking-wider font-semibold text-[10px] print:text-slate-600">O‘quvchi FIO</div>
            <div className="text-white font-bold text-sm truncate mt-0.5 print:text-black">{result.student.fullName}</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase tracking-wider font-semibold text-[10px] print:text-slate-600">Sinfi</div>
            <div className="text-white font-bold text-sm mt-0.5 print:text-black">{result.student.grade}-sinf</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase tracking-wider font-semibold text-[10px] print:text-slate-600">RIASEC Kodi</div>
            <div className="text-emerald-400 font-mono font-bold text-sm mt-0.5 print:text-emerald-800">{result.riasec.primaryCode}</div>
          </div>
          <div>
            <div className="text-slate-400 uppercase tracking-wider font-semibold text-[10px] print:text-slate-600">Sana</div>
            <div className="text-white font-bold text-sm mt-0.5 print:text-black">
              {new Date(result.createdAt).toLocaleDateString('uz-UZ')}
            </div>
          </div>
        </div>

        {/* Top Matched Career Spotlight */}
        <div className="mb-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 relative overflow-hidden shadow-xl print:bg-none print:border-emerald-700">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <img
              src={selectedCareer.imageUrl}
              alt={selectedCareer.nameUz}
              referrerPolicy="no-referrer"
              className="w-full md:w-56 h-48 rounded-2xl object-cover border border-slate-700 shadow-lg flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20">
                  {t.matchedTopCareer}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {selectedCareer.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3 print:text-black">
                {selectedCareer.nameUz}
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-4 print:text-slate-800">
                {selectedCareer.descriptionUz}
              </p>

              {/* Key Skills Pills */}
              <div className="flex flex-wrap items-center gap-1.5 mb-4">
                {selectedCareer.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium print:bg-slate-200 print:text-black"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 print:bg-slate-100 print:text-black">
                  <div className="font-semibold text-emerald-400 mb-1 print:text-emerald-800 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t.requiredSubjects}</span>
                  </div>
                  <div className="text-slate-300 print:text-slate-800">{selectedCareer.subjects.join(', ')}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 print:bg-slate-100 print:text-black">
                  <div className="font-semibold text-teal-400 mb-1 print:text-teal-800 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{t.suggestedUniversities}</span>
                  </div>
                  <div className="text-slate-300 print:text-slate-800">{selectedCareer.educationPath}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Stage Career Roadmap */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 print:text-black">
              <Compass className="w-5 h-5 text-emerald-400" />
              <span>{t.careerRoadmap} ({selectedCareer.nameUz})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[selectedCareer.learningPath.stage1, selectedCareer.learningPath.stage2, selectedCareer.learningPath.stage3, selectedCareer.learningPath.stage4].map((stage, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 relative flex flex-col justify-between print:bg-slate-50 print:border-slate-300"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-emerald-400 print:text-emerald-800">
                      {idx + 1}-bosqich
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700 font-mono print:bg-slate-200 print:text-black">
                      {stage.period}
                    </span>
                  </div>
                  <div className="font-bold text-sm text-white mb-2 print:text-black">
                    {stage.title}
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 print:text-slate-800">
                    {stage.items.map((it, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Matched Careers Switcher (Click to inspect) */}
        <div className="mb-10 no-print">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
            Sizga tavsiya etilgan eng yuqori 5 ta kasb (bosing va tahlilini ko‘ring):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
            {result.matchedCareers.slice(0, 5).map((m, idx) => {
              const isSelected = selectedCareer.id === m.career.id;
              return (
                <button
                  key={m.career.id}
                  onClick={() => setSelectedCareer(m.career)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>#{idx + 1} o‘rin</span>
                    <span className="font-bold text-emerald-400">{m.matchPercentage}%</span>
                  </div>
                  <div className="font-bold text-xs text-white line-clamp-1">
                    {m.career.nameUz}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {m.career.category}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 8-Dimensional Spectrum Analysis & Pressure Index */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* 8 Dimensions */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-800/50 border border-slate-700/70 print:bg-white print:border-slate-300">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 print:text-black">
              <TrendingUp className="w-5 h-5 text-teal-400" />
              <span>{t.dimensionsBreakdown}</span>
            </h3>
            <div className="space-y-3">
              {dimensionItems.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium print:text-black">{item.label}</span>
                    <span className="font-bold text-white font-mono print:text-black">{item.val}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden print:bg-slate-200">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pressure & RIASEC Box */}
          <div className="flex flex-col gap-4">
            {/* Pressure Index Card */}
            <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-700/70 print:bg-white print:border-slate-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider print:text-slate-600">
                  {t.pressureIndexTitle}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    result.pressureIndex >= 60
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : result.pressureIndex >= 35
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {result.pressureIndex}%
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed print:text-slate-800">
                {result.pressureAssessment}
              </p>
            </div>

            {/* RIASEC Card */}
            <div className="p-5 rounded-3xl bg-slate-800/50 border border-slate-700/70 print:bg-white print:border-slate-300 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider print:text-slate-600">
                  {t.riasecProfile}
                </span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1 print:text-emerald-800">
                  {result.riasec.primaryCode}
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center mt-3 text-[11px] font-mono">
                  <div className="p-1.5 rounded bg-slate-800 text-slate-300 print:bg-slate-200 print:text-black">R: {result.riasec.R}%</div>
                  <div className="p-1.5 rounded bg-slate-800 text-slate-300 print:bg-slate-200 print:text-black">I: {result.riasec.I}%</div>
                  <div className="p-1.5 rounded bg-slate-800 text-slate-300 print:bg-slate-200 print:text-black">A: {result.riasec.A}%</div>
                  <div className="p-1.5 rounded bg-slate-800 text-slate-300 print:bg-slate-200 print:text-black">S: {result.riasec.S}%</div>
                  <div className="p-1.5 rounded bg-slate-800 text-slate-300 print:bg-slate-200 print:text-black">E: {result.riasec.E}%</div>
                  <div className="p-1.5 rounded bg-slate-800 text-slate-300 print:bg-slate-200 print:text-black">C: {result.riasec.C}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini 3.1 Pro High Thinking Counseling Report */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-900 border border-purple-500/30 shadow-xl mb-10 print:bg-none print:border-slate-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white print:text-black">
                  {t.aiThinkingTitle}
                </h3>
                <span className="text-[11px] text-purple-300 font-mono">
                  Model: gemini-3.1-pro-preview • thinkingLevel: HIGH
                </span>
              </div>
            </div>
          </div>

          {/* Analysis Text Box */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/20 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line mb-6 print:bg-white print:text-black print:border-none">
            {aiAnalysisText}
          </div>

          {/* Strategic Steps */}
          {strategicSteps && strategicSteps.length > 0 && (
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-purple-300 font-bold mb-2">
                O‘quvchi uchun 4 ta ustuvor strategik qadam:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {strategicSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-800/80 border border-purple-500/20 text-xs text-slate-300 flex items-start gap-2 print:bg-slate-100 print:text-black"
                  >
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parent recommendations */}
          {result.recommendationsForParents && (
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 leading-relaxed mb-6 print:bg-slate-100 print:text-black">
              <span className="font-bold text-white block mb-1 print:text-black">Ota-onalar uchun tavsiya:</span>
              {result.recommendationsForParents}
            </div>
          )}

          {/* Interactive AI Query Form (no-print) */}
          <form onSubmit={handleAskAi} className="no-print pt-4 border-t border-purple-500/20">
            <div className="text-xs font-semibold text-slate-300 mb-2">
              Sun'iy intellekt maslahatchisiga shaxsiy savolingizni bering (Yuqori fikrlash rejimida javob beradi):
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Masalan: 'Uychi tumanida ushbu kasbga qayerda tayyorgarlik ko‘rsam bo‘ladi?'"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
              />
              <button
                type="submit"
                disabled={aiThinkingLoading || !customQuestion.trim()}
                className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 disabled:opacity-40 transition-colors shadow-md"
              >
                {aiThinkingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Fikrlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>So‘rash</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Official School Seal & Signatures (for printing) */}
        <div className="border-t border-slate-800 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 print:border-black/20 print:text-black">
          <div className="text-center sm:text-left">
            <div className="font-bold text-slate-200 print:text-black">
              41-maktab Kasb-hunarga yo‘naltirish komissiyasi
            </div>
            <div>Maktab direktori va amaliyotchi psixologi</div>
          </div>
          <div className="p-3 rounded-2xl border border-emerald-500/40 text-center font-serif text-[11px] text-emerald-400 print:text-emerald-800 print:border-emerald-800">
            ★ NAMANGAN VILOYATI UYCHI TUMANI ★<br />
            41-SONLI MAKTABNING RASMIY KASBIY XULOSASI
          </div>
        </div>
      </div>
    </div>
  );
};
