import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Award,
  Download,
  Search,
  FileText,
  TrendingUp,
  GraduationCap,
  ExternalLink,
  Eye,
  Loader2
} from 'lucide-react';
import { TestResult, Language } from '../types';
import { translations } from '../i18n';
import { getLocalResults } from '../services/assessmentService';

interface AdminDashboardProps {
  language: Language;
  token: string;
  adminUser: any;
  onViewStudentResult: (result: TestResult) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  token,
  adminUser,
  onViewStudentResult
}) => {
  const t = translations[language];

  const [stats, setStats] = useState<any>(null);
  const [studentsList, setStudentsList] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [statsRes, studentsRes] = await Promise.all([
          fetch('/api/admin/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('/api/admin/students', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const statsType = statsRes.headers.get('content-type');
        const studentsType = studentsRes.headers.get('content-type');

        if (statsRes.ok && statsType && statsType.includes('application/json') &&
            studentsRes.ok && studentsType && studentsType.includes('application/json')) {
          const statsData = await statsRes.json();
          const studentsData = await studentsRes.json();

          if (statsData.success) setStats(statsData);
          if (studentsData.success && Array.isArray(studentsData.results)) {
            setStudentsList(studentsData.results);
            return;
          }
        }
        throw new Error('Fallback to local assessment storage');
      } catch (err) {
        // Build fallback statistics from local tests
        const local = getLocalResults();
        setStudentsList(local);

        const gradeMap: Record<string, number> = {};
        const careerMap: Record<string, number> = {};
        let pressureSum = 0;

        local.forEach(r => {
          const g = r.student?.grade || '9-A';
          gradeMap[g] = (gradeMap[g] || 0) + 1;
          const topC = r.matchedCareers?.[0]?.career?.nameUz || 'Boshqa';
          careerMap[topC] = (careerMap[topC] || 0) + 1;
          pressureSum += r.pressureIndex || 0;
        });

        const topCareers = Object.entries(careerMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setStats({
          success: true,
          totalAssessments: local.length,
          avgPressureIndex: local.length > 0 ? Math.round(pressureSum / local.length) : 24,
          gradeBreakdown: gradeMap,
          topMatchedCareers: topCareers
        });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token]);

  const handleExportCsv = () => {
    if (studentsList.length > 0) {
      const headers = ['Ism-familiya', 'Sinf', 'Jinsi', 'Telefon', 'Sana', 'Asosiy Kasb', 'Moslik %', 'RIASEC Kodi', 'Tashqi Bosim'];
      const rows = studentsList.map(r => [
        `"${r.student?.fullName || ''}"`,
        `"${r.student?.grade || ''}"`,
        `"${r.student?.gender || ''}"`,
        `"${r.student?.phone || ''}"`,
        `"${r.createdAt ? new Date(r.createdAt).toLocaleDateString('uz-UZ') : ''}"`,
        `"${r.matchedCareers?.[0]?.career?.nameUz || ''}"`,
        `"${r.matchedCareers?.[0]?.matchPercentage || ''}%"`,
        `"${r.riasec?.primaryCode || ''}"`,
        `"${r.pressureIndex}%"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `41_maktab_diagnostika_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open('/api/admin/export', '_blank');
    }
  };

  const filteredStudents = studentsList.filter(s => {
    const matchesGrade = selectedGrade === 'All' || s.student.grade === selectedGrade;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesGrade;
    return (
      matchesGrade &&
      (s.student.fullName.toLowerCase().includes(q) ||
        s.matchedCareers[0]?.career.nameUz.toLowerCase().includes(q) ||
        s.riasec.primaryCode.toLowerCase().includes(q))
    );
  });

  const allGrades = ['All', ...Array.from(new Set(studentsList.map(s => s.student.grade)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {adminUser?.role === 'ADMIN' ? 'Bosh Administrator' : 'Maktab Amaliyotchi Psixologi'}
            </span>
            <span className="text-xs text-slate-400">41-sonli umumiy o‘rta ta'lim maktabi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {t.analyticsTitle}
          </h1>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{t.exportCsv}</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-emerald-400" />
          <div>Ma'lumotlar yuklanmoqda...</div>
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Jami diagnostika qilinganlar</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white">{stats?.totalTests || 0}</div>
              <div className="text-[11px] text-emerald-400 mt-1">41-maktab o‘quvchilari</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Eng ommabop yo‘nalish</span>
                <TrendingUp className="w-4 h-4 text-teal-400" />
              </div>
              <div className="text-xl font-bold text-white truncate">
                {stats?.categoryCounts ? Object.keys(stats.categoryCounts)[0] || 'IT & Dasturlash' : 'IT'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">O‘quvchilar qiziqishi bo‘yicha</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Faol sinflar soni</span>
                <GraduationCap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {stats?.gradeCounts ? Object.keys(stats.gradeCounts).length : 0}
              </div>
              <div className="text-[11px] text-purple-400 mt-1">7-sinfdan 11-sinfgacha</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>O‘rtacha IT mosligi</span>
                <Award className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-3xl font-black text-white">
                {stats?.avgDimensions?.tech || 68}%
              </div>
              <div className="text-[11px] text-blue-400 mt-1">Texnologik qobiliyat ko‘rsatkichi</div>
            </div>
          </div>

          {/* Students Records Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-white">
                O‘quvchilar test natijalari ro‘yxati ({filteredStudents.length} ta)
              </h2>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ism yoki kasb bo‘yicha..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Grade Filter */}
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {allGrades.map((g) => (
                    <option key={g} value={g} className="bg-slate-800">
                      {g === 'All' ? 'Barcha sinflar' : `${g}-sinf`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            {filteredStudents.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                Natijalar topilmadi
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3 rounded-l-xl">O‘quvchi FIO</th>
                      <th className="px-4 py-3">Sinfi</th>
                      <th className="px-4 py-3">Tavsiya etilgan kasb</th>
                      <th className="px-4 py-3">RIASEC</th>
                      <th className="px-4 py-3">Bosim indeksi</th>
                      <th className="px-4 py-3">Sana</th>
                      <th className="px-4 py-3 rounded-r-xl text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredStudents.map((res) => {
                      const topCareer = res.matchedCareers[0]?.career;
                      const matchPct = res.matchedCareers[0]?.matchPercentage || 85;

                      return (
                        <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 py-3.5 font-semibold text-white">
                            {res.student.fullName}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono">
                              {res.student.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-medium text-white">{topCareer?.nameUz || '—'}</div>
                            <div className="text-[10px] text-slate-400">{topCareer?.category} • {matchPct}%</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-mono font-bold text-teal-400">
                              {res.riasec.primaryCode}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                res.pressureIndex >= 60
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : res.pressureIndex >= 35
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              {res.pressureIndex}%
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-slate-400">
                            {new Date(res.createdAt).toLocaleDateString('uz-UZ')}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => onViewStudentResult(res)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Pasport</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
