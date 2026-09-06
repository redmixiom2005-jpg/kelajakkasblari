import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  GraduationCap,
  Sparkles,
  ExternalLink,
  X,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Career, Language } from '../types';
import { translations } from '../i18n';
import { CAREERS } from '../data/careers';

interface CareerAtlasProps {
  onSelectCareerToTest?: (career: Career) => void;
  language: Language;
}

export const CareerAtlas: React.FC<CareerAtlasProps> = ({ language, onSelectCareerToTest }) => {
  const t = translations[language];

  // Initialize immediately with bundled 200+ careers so Vercel / offline never shows 0
  const [careers, setCareers] = useState<Career[]>(CAREERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCareerModal, setActiveCareerModal] = useState<Career | null>(null);

  useEffect(() => {
    async function fetchCareers() {
      try {
        const res = await fetch('/api/careers');
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.success && Array.isArray(data.careers) && data.careers.length > 0) {
            setCareers(data.careers);
          }
        }
      } catch (err) {
        // Fallback to bundled CAREERS is already active
        console.debug('Using bundled careers catalog');
      }
    }
    fetchCareers();
  }, []);

  // Distinct categories
  const categories = ['All', ...Array.from(new Set(careers.map(c => c.category)))];

  // Filtering
  const filteredCareers = careers.filter(c => {
    const matchesCat = selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCat;

    const matchesSearch =
      c.nameUz.toLowerCase().includes(q) ||
      c.nameKrill.toLowerCase().includes(q) ||
      c.nameRu.toLowerCase().includes(q) ||
      c.nameEn.toLowerCase().includes(q) ||
      c.descriptionUz.toLowerCase().includes(q) ||
      c.skills.some(s => s.toLowerCase().includes(q)) ||
      c.subjects.some(s => s.toLowerCase().includes(q));

    return matchesCat && matchesSearch;
  });

  const getCareerName = (c: Career) => {
    if (language === 'krill') return c.nameKrill;
    if (language === 'ru') return c.nameRu;
    if (language === 'en') return c.nameEn;
    return c.nameUz;
  };

  const getCareerDesc = (c: Career) => {
    if (language === 'krill') return c.descriptionKrill;
    if (language === 'ru') return c.descriptionRu;
    if (language === 'en') return c.descriptionEn;
    return c.descriptionUz;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-3 inline-block">
          41-Maktab Kasblar Atlasi
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          200+ Zamonaviy va Talabgir Kasblar
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400">
          O‘zbekiston va jahon mehnat bozoridagi barcha asosiy sohalarning to‘liq tavsifi, talab etiladigan fanlar va 4 bosqichli amaliy yo‘l xaritasi.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm shadow-md transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {cat === 'All' ? t.allCategories : cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 flex items-center justify-between">
          <span>Topildi: <strong className="text-white">{filteredCareers.length}</strong> ta kasb</span>
          {selectedCategory !== 'All' && (
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-teal-400 hover:underline"
            >
              Barchasini ko‘rsatish
            </button>
          )}
        </div>
      </div>

      {/* Careers Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <div>Kasblar atlasi yuklanmoqda...</div>
        </div>
      ) : filteredCareers.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <div className="text-base font-semibold text-slate-400">Hech qanday kasb topilmadi</div>
          <div className="text-xs mt-1">Qidiruv so‘zini o‘zgartirib ko‘ring yoki toifani tozalang</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCareers.map((c) => (
            <div
              key={c.id}
              onClick={() => setActiveCareerModal(c)}
              className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-teal-500/50 transition-all transform hover:-translate-y-1 shadow-lg cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Career Image */}
                <div className="relative h-44 overflow-hidden bg-slate-950">
                  <img
                    src={c.imageUrl}
                    alt={c.nameUz}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900/80 backdrop-blur-md text-teal-300 border border-teal-500/30">
                    {c.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-1 mb-2">
                    {getCareerName(c)}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {getCareerDesc(c)}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {c.skills.slice(0, 3).map((sk, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {sk}
                      </span>
                    ))}
                    {c.skills.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500">
                        +{c.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                <span className="line-clamp-1 text-[11px]">
                  Fanlar: {c.subjects.slice(0, 2).join(', ')}
                </span>
                <span className="text-teal-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Batafsil <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dossier for Selected Career */}
      {activeCareerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveCareerModal(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image & Title */}
            <div className="flex flex-col sm:flex-row gap-5 items-start mb-6">
              <img
                src={activeCareerModal.imageUrl}
                alt={activeCareerModal.nameUz}
                referrerPolicy="no-referrer"
                className="w-full sm:w-44 h-36 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
              />
              <div className="flex-1">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  {activeCareerModal.category}
                </span>
                <h2 className="text-2xl font-black text-white mt-2 mb-2">
                  {getCareerName(activeCareerModal)}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {getCareerDesc(activeCareerModal)}
                </p>
              </div>
            </div>

            {/* Skills & Subjects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-teal-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Asosiy ko‘nikmalar (Skills)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeCareerModal.skills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Maktabdagi asosiy fanlar</span>
                </div>
                <div className="text-slate-300 font-medium leading-relaxed">
                  {activeCareerModal.subjects.join(', ')}
                </div>
              </div>
            </div>

            {/* Education Path & Future Outlook */}
            <div className="space-y-3 mb-6 text-xs">
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                <span className="font-bold text-teal-400 block mb-1">
                  Ta'lim yo‘nalishlari va oliygohlar:
                </span>
                <span className="text-slate-300">{activeCareerModal.educationPath}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                <span className="font-bold text-teal-400 block mb-1">
                  Kelajak istiqboli va mehnat bozori:
                </span>
                <span className="text-slate-300">{activeCareerModal.futureOutlook}</span>
              </div>
            </div>

            {/* 4-Stage Roadmap */}
            <div>
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-teal-400" />
                <span>4 bosqichli amaliy yo‘l xaritasi:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  activeCareerModal.learningPath.stage1,
                  activeCareerModal.learningPath.stage2,
                  activeCareerModal.learningPath.stage3,
                  activeCareerModal.learningPath.stage4
                ].map((st, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-teal-400">{idx + 1}-bosqich</span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-300 font-mono">
                        {st.period}
                      </span>
                    </div>
                    <div className="font-semibold text-white mb-1.5">{st.title}</div>
                    <ul className="space-y-1 text-slate-300">
                      {st.items.map((it, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-right">
              <button
                onClick={() => setActiveCareerModal(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
