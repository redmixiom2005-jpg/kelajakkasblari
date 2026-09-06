import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Compass,
  User,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Loader2,
  Bookmark,
  RotateCcw
} from 'lucide-react';
import { Question, Language, TestResult } from '../types';
import { translations } from '../i18n';
import { QUESTIONS } from '../data/questions';
import { submitAssessmentClient } from '../services/assessmentService';

interface TestStepperProps {
  language: Language;
  onTestComplete: (result: TestResult) => void;
  onCancel: () => void;
}

export const TestStepper: React.FC<TestStepperProps> = ({ language, onTestComplete, onCancel }) => {
  const t = translations[language];

  const [step, setStep] = useState<'profile' | 'quiz' | 'submitting'>('profile');
  // Initialize with QUESTIONS directly so Vercel or offline never hangs on "Savollar yuklanmoqda..."
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Student Profile State
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('9-A');
  const [gender, setGender] = useState('O‘g‘il bola');
  const [phone, setPhone] = useState('');

  // Quiz State: answers map questionId -> score (1..5)
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [errorMsg, setErrorMsg] = useState('');

  // Grades available in 41-maktab
  const gradesList = [
    '7-A', '7-B', '7-V',
    '8-A', '8-B', '8-V',
    '9-A', '9-B', '9-V', '9-G',
    '10-A', '10-B', '10-V',
    '11-A', '11-B', '11-V'
  ];

  // Load questions and restore saved session if present
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('/api/questions');
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
            setQuestions(data.questions);
          }
        }
      } catch (e) {
        // Questions are already pre-loaded via QUESTIONS
        console.debug('Using pre-bundled questions');
      }
    }
    fetchQuestions();

    // Restore from localStorage
    try {
      const saved = localStorage.getItem('kasbim_test_backup');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.grade) setGrade(parsed.grade);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.currentIndex !== undefined) setCurrentIndex(parsed.currentIndex);
        if (parsed.step) setStep(parsed.step);
      }
    } catch (err) {
      console.warn('Could not read localStorage backup:', err);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        'kasbim_test_backup',
        JSON.stringify({
          fullName,
          grade,
          gender,
          phone,
          answers,
          currentIndex,
          step
        })
      );
    } catch (e) {
      // ignore storage quota errors
    }
  }, [fullName, grade, gender, phone, answers, currentIndex, step]);

  const handleStartQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Iltimos, familiya va ismingizni kiriting');
      return;
    }
    setErrorMsg('');
    setStep('quiz');
  };

  const handleAnswer = (score: number) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: score }));

    // Auto advance to next question smoothly if not last
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const getQuestionText = (q: Question) => {
    if (language === 'krill') return q.questionKrill;
    if (language === 'ru') return q.questionRu;
    if (language === 'en') return q.questionEn;
    return q.questionUz;
  };

  const handleSubmitTest = async () => {
    if (answeredCount < questions.length) {
      setErrorMsg(`Iltimos, barcha 40 ta savolga javob bering! Hozirda ${answeredCount} / ${questions.length} ta savol belgilangan.`);
      return;
    }

    setStep('submitting');
    setErrorMsg('');

    try {
      const answersPayload = Object.entries(answers).map(([questionId, score]) => ({
        questionId,
        score: Number(score)
      }));

      const result = await submitAssessmentClient(
        { fullName, grade, gender, phone },
        answersPayload
      );

      // Clear saved test
      localStorage.removeItem('kasbim_test_backup');

      // Confetti celebration
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      onTestComplete(result);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg(err.message || 'Xatolik yuz berdi. Iltimos qaytadan urinib ko‘ring.');
      setStep('quiz');
    }
  };

  const resetTest = () => {
    if (window.confirm('Rostdan ham testni boshidan boshlamoqchimisiz? Barcha javoblaringiz o‘chiriladi.')) {
      setAnswers({});
      setCurrentIndex(0);
      setStep('profile');
      localStorage.removeItem('kasbim_test_backup');
    }
  };

  // Step 1: Profile Registration
  if (step === 'profile') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto text-slate-950 mb-4 shadow-lg shadow-emerald-500/20">
              <User className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t.stepStudentInfo}
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Namangan viloyati, Uychi tumani, 41-sonli umumiy o‘rta ta'lim maktabi o‘quvchisi
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleStartQuiz} className="space-y-5">
            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {t.fullName} <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masalan: Soliyev Jasurbek Akramjon o‘g‘li"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>

            {/* Grade & Gender Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {t.gradeClass} <span className="text-emerald-400">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm cursor-pointer"
                >
                  {gradesList.map((g) => (
                    <option key={g} value={g} className="bg-slate-800">
                      {g}-sinf
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {t.gender}
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm cursor-pointer"
                >
                  <option value="O‘g‘il bola" className="bg-slate-800">{t.male}</option>
                  <option value="Qiz bola" className="bg-slate-800">{t.female}</option>
                </select>
              </div>
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {t.phoneOptional}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              />
            </div>

            {/* Submit button */}
            <div className="pt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
              >
                <span>{t.startQuestions}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 3: Submitting state
  if (step === 'submitting') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl">
          <Loader2 className="w-14 h-14 text-emerald-400 animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">Natijalar hisoblanmoqda...</h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            40 ta savol natijalari 8 yo‘nalish bo‘yicha tahlil qilinib, Holland RIASEC kodi va 200+ kasblar bazasiga moslashtirilmoqda.
          </p>
          <div className="mt-6 flex flex-col gap-2 max-w-xs mx-auto text-xs text-slate-400">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>8-vektor psixometrik baholash</span>
            </div>
            <div className="flex items-center gap-2 text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>RIASEC shaxsiyat kodi aniqlandi</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Gemini 3.1 Pro chuqur tavsiyalar tayyorlanmoqda</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: 40 Questions Quiz Stepper
  if (loadingQuestions || !currentQuestion) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-400" />
        <div>Savollar yuklanmoqda...</div>
      </div>
    );
  }

  const currentScore = answers[currentQuestion.id];

  const scaleOptions = [
    { score: 1, label: t.stronglyDisagree, color: 'hover:border-rose-500 hover:bg-rose-500/10' },
    { score: 2, label: t.disagree, color: 'hover:border-orange-500 hover:bg-orange-500/10' },
    { score: 3, label: t.neutral, color: 'hover:border-slate-500 hover:bg-slate-500/10' },
    { score: 4, label: t.agree, color: 'hover:border-teal-500 hover:bg-teal-500/10' },
    { score: 5, label: t.stronglyAgree, color: 'hover:border-emerald-500 hover:bg-emerald-500/10' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
      {/* Top status bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-sm shadow-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{fullName}</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">
              {grade}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetTest}
              className="text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors"
              title="Qaytadan boshlash"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Qayta boshlash</span>
            </button>
            <span className="font-semibold text-emerald-400">
              {answeredCount} / {questions.length} ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl relative">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span>{t.questionProgress} #{currentIndex + 1} / {questions.length}</span>
          </span>

          <button
            onClick={() => setBookmarked(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
            className={`p-2 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              bookmarked[currentQuestion.id]
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-500 hover:text-slate-300 bg-slate-800/50'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Belgilab qo‘yish</span>
          </button>
        </div>

        {/* Question Text */}
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-relaxed mb-8">
          {getQuestionText(currentQuestion)}
        </h3>

        {/* Likert 5 Options */}
        <div className="space-y-3">
          {scaleOptions.map((opt) => {
            const isSelected = currentScore === opt.score;
            return (
              <button
                key={opt.score}
                onClick={() => handleAnswer(opt.score)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold shadow-md shadow-emerald-500/10'
                    : `bg-slate-800/60 border-slate-700/80 text-slate-200 ${opt.color}`
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {opt.score}
                  </div>
                  <span className="text-sm sm:text-base">{opt.label}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Stepper Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.previous}</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
            >
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmitTest}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.finishTest}</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Jump 40 Question Grid */}
      <div className="mt-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Savollar jadvali ({answeredCount} / {questions.length} bajarildi)</span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            const isMarked = bookmarked[q.id];

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-8 sm:h-9 rounded-lg text-xs font-bold transition-all relative flex items-center justify-center ${
                  isCurrent
                    ? 'ring-2 ring-emerald-400 bg-emerald-500 text-slate-950'
                    : isAnswered
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <span>{idx + 1}</span>
                {isMarked && (
                  <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
