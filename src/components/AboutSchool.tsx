import React from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Compass,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  HeartHandshake
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

interface AboutSchoolProps {
  language: Language;
  onStartTest: () => void;
}

export const AboutSchool: React.FC<AboutSchoolProps> = ({ language, onStartTest }) => {
  const t = translations[language];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Hero card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            Maktab Tarixi & Missiyasi
          </span>
          <span className="text-xs text-slate-400">Namangan viloyati • Uychi tumani</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4">
          41-sonli Umumiy O‘rta Ta'lim Maktabi
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mb-8">
          Namangan viloyati, Uychi tumani, 41-sonli umumiy o‘rta ta'lim maktabi — o‘quvchilarning har tomonlama bilim olishi, intellektual salohiyatini ro‘yobga chiqarishi hamda zamonaviy mehnat bozorida raqobatbardosh kasb egasi bo‘lib yetishishiga xizmat qiluvchi ilg‘or ta'lim dargohidir.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-2xl font-black text-emerald-400 mb-1">1000+</div>
            <div className="text-xs text-slate-300 font-semibold">Iqtidorli o‘quvchilar</div>
            <div className="text-[11px] text-slate-400 mt-0.5">7-11 sinflarda tahsil oluvchilar</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-2xl font-black text-teal-400 mb-1">60+</div>
            <div className="text-xs text-slate-300 font-semibold">Tajribali pedagoglar</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Oliy va birinchi toifali ustozlar</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-2xl font-black text-blue-400 mb-1">200+</div>
            <div className="text-xs text-slate-300 font-semibold">Kasbiy yo‘nalishlar</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Diagnostika va amaliy to‘garaklar</div>
          </div>
        </div>
      </div>

      {/* Mission & Guidance Department */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">
            Kasbga Yo‘naltirish Tizimimizning Maqsadi
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            Maktabimizda har bir o‘quvchi o‘z shaxsiy xohish-irodasi, tabiiy qobiliyati va dunyoqarashiga tayanib kasb tanlashi zarur deb hisoblaymiz. 8 qirrali psixometrik baholash tizimi o‘quvchini sun'iy bosimlardan xoli qilib, uning eng kuchli jihatlarini ko‘rsatib beradi.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>O‘quvchining 40 ta savol orqali psixologik portretini tuzish</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Ota-onalar va psixologlar uchun ilmiy tavsiyalar ishlab chiqish</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Oliygohlar va kollejlarga maqsadli yo‘naltirish</span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white mb-3">
            Psixologik Qo‘llab-quvvatlash Xizmati
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            Maktabimizning amaliyotchi psixologi va sinf rahbarlari har bir test natijasini alohida tahlil qiladilar. Agarda o‘quvchida oilaviy bosim indeksi yuqori bo‘lsa, ota-ona bilan samimiy suhbatlar tashkil qilinadi.
          </p>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            <div className="font-bold text-teal-400 mb-1">Psixolog qabul kunlari:</div>
            <div>Dushanba - Juma: soat 08:30 dan 16:00 gacha</div>
            <div className="mt-1 text-slate-400">41-maktab 2-qavat, 204-xona (Psixolog xonasi)</div>
          </div>
        </div>
      </div>

      {/* School Contact Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-xs sm:text-sm text-slate-300">
          <div className="text-base font-bold text-white">41-sonli umumiy o‘rta ta'lim maktabi ma'muriyati</div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Namangan viloyati, Uychi tumani, 41-sonli maktab</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <span>+998 (69) 482-12-41</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>maktab41uychi@namangan.uz</span>
          </div>
        </div>

        <button
          onClick={onStartTest}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex-shrink-0"
        >
          {t.startAssessment}
        </button>
      </div>
    </div>
  );
};
