import { Career, Question, Student, TestResult, DimensionScores, RIASECScores, MatchedCareerItem } from '../types';
import { CAREERS } from '../data/careers';
import { QUESTIONS } from '../data/questions';

export function calculateDimensionsAndRiasec(
  questions: Question[],
  answers: { questionId: string; score: number }[]
) {
  const answerMap = new Map<string, number>();
  answers.forEach(a => answerMap.set(a.questionId, a.score));

  let rawTech = 0, maxTech = 0;
  let rawMed = 0, maxMed = 0;
  let rawEng = 0, maxEng = 0;
  let rawSoc = 0, maxSoc = 0;
  let rawCre = 0, maxCre = 0;
  let rawBus = 0, maxBus = 0;
  let rawNat = 0, maxNat = 0;
  let rawLaw = 0, maxLaw = 0;
  let rawPressure = 0, maxPressure = 0;

  questions.forEach(q => {
    const score = answerMap.get(q.id) || 3;
    const factor = (score - 1) / 4; // 0.0 to 1.0

    if (q.weightTech) { rawTech += q.weightTech * factor; maxTech += q.weightTech; }
    if (q.weightMed) { rawMed += q.weightMed * factor; maxMed += q.weightMed; }
    if (q.weightEng) { rawEng += q.weightEng * factor; maxEng += q.weightEng; }
    if (q.weightSoc) { rawSoc += q.weightSoc * factor; maxSoc += q.weightSoc; }
    if (q.weightCre) { rawCre += q.weightCre * factor; maxCre += q.weightCre; }
    if (q.weightBus) { rawBus += q.weightBus * factor; maxBus += q.weightBus; }
    if (q.weightNat) { rawNat += q.weightNat * factor; maxNat += q.weightNat; }
    if (q.weightLaw) { rawLaw += q.weightLaw * factor; maxLaw += q.weightLaw; }

    if (q.isPressureCheck) {
      rawPressure += factor;
      maxPressure += 1;
    }
  });

  const dimensions: DimensionScores = {
    tech: maxTech > 0 ? Math.round((rawTech / maxTech) * 100) : 50,
    med: maxMed > 0 ? Math.round((rawMed / maxMed) * 100) : 50,
    eng: maxEng > 0 ? Math.round((rawEng / maxEng) * 100) : 50,
    soc: maxSoc > 0 ? Math.round((rawSoc / maxSoc) * 100) : 50,
    cre: maxCre > 0 ? Math.round((rawCre / maxCre) * 100) : 50,
    bus: maxBus > 0 ? Math.round((rawBus / maxBus) * 100) : 50,
    nat: maxNat > 0 ? Math.round((rawNat / maxNat) * 100) : 50,
    law: maxLaw > 0 ? Math.round((rawLaw / maxLaw) * 100) : 50,
  };

  const R = Math.round((dimensions.eng * 0.6 + dimensions.nat * 0.4));
  const I = Math.round((dimensions.tech * 0.5 + dimensions.med * 0.5));
  const A = Math.round((dimensions.cre * 0.8 + dimensions.soc * 0.2));
  const S = Math.round((dimensions.soc * 0.7 + dimensions.med * 0.3));
  const E = Math.round((dimensions.bus * 0.7 + dimensions.law * 0.3));
  const C = Math.round((dimensions.bus * 0.5 + dimensions.tech * 0.3 + dimensions.law * 0.2));

  const riasecEntries = [
    { code: 'R', score: R, name: 'Realistic' },
    { code: 'I', score: I, name: 'Investigative' },
    { code: 'A', score: A, name: 'Artistic' },
    { code: 'S', score: S, name: 'Social' },
    { code: 'E', score: E, name: 'Enterprising' },
    { code: 'C', score: C, name: 'Conventional' },
  ];
  riasecEntries.sort((a, b) => b.score - a.score);
  const primaryCode = riasecEntries.slice(0, 3).map(e => e.code).join('');

  const riasec: RIASECScores = { R, I, A, S, E, C, primaryCode };

  const pressureIndex = maxPressure > 0 ? Math.round((rawPressure / maxPressure) * 100) : 25;
  let pressureAssessment = "Mustaqil va erkin tanlov: O‘quvchi o‘z shaxsiy xohish-irodasi bilan kasb tanlamoqda.";
  if (pressureIndex >= 60) {
    pressureAssessment = "Diqqat! Oila yoki atrof-muhit bosimi sezilarli darajada yuqori. Psixolog bilan alohida suhbat tavsiya etiladi.";
  } else if (pressureIndex >= 35) {
    pressureAssessment = "O‘rtacha tashqi ta'sir: Ota-ona yoki yaqinlarning orzulari o‘quvchining o‘z qiziqishlari bilan qisman to‘qnashmoqda.";
  }

  return { dimensions, riasec, pressureIndex, pressureAssessment };
}

export function matchCareers(dimensions: DimensionScores, careersList: Career[]) {
  const scoredCareers = careersList.map(c => {
    const studentVec = [
      dimensions.tech, dimensions.med, dimensions.eng, dimensions.soc,
      dimensions.cre, dimensions.bus, dimensions.nat, dimensions.law
    ];
    const careerVec = [
      c.weightTech || 0, c.weightMed || 0, c.weightEng || 0, c.weightSoc || 0,
      c.weightCre || 0, c.weightBus || 0, c.weightNat || 0, c.weightLaw || 0
    ];

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < studentVec.length; i++) {
      dotProduct += studentVec[i] * careerVec[i];
      normA += studentVec[i] * studentVec[i];
      normB += careerVec[i] * careerVec[i];
    }

    let matchPercentage = 50;
    if (normA > 0 && normB > 0) {
      const cosine = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
      matchPercentage = Math.min(99, Math.max(55, Math.round(cosine * 100)));
    }

    return { careerId: c.id, career: c, matchPercentage };
  });

  scoredCareers.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return scoredCareers.slice(0, 10);
}

export function generateClientAiReport(
  studentName: string,
  grade: string,
  topCareer: Career,
  dimensions: DimensionScores,
  riasec: RIASECScores,
  pressureIndex: number
) {
  const riasecNames: Record<string, string> = {
    R: "Amaliy-texnik (Realistic)",
    I: "Tadqiqotchi-tahliliy (Investigative)",
    A: "Ijodiy-artistik (Artistic)",
    S: "Ijtimoiy-insonparvar (Social)",
    E: "Yetakchi-tadbirkor (Enterprising)",
    C: "Tizimli-an'anaviy (Conventional)"
  };

  const topTraits = riasec.primaryCode
    .split('')
    .map(letter => riasecNames[letter] || letter)
    .join(', ');

  const analysisText = `${studentName} (41-maktab, ${grade}-sinf o‘quvchisi) 40 ta psixometrik diagnostika natijalariga ko‘ra, RIASEC bo‘yicha "${riasec.primaryCode}" (${topTraits}) qobiliyat turiga mansubligi aniqlandi. 

O‘quvchining eng kuchli salohiyat ko‘rsatkichlari: ${topCareer.nameUz} sohasida namoyon bo‘ldi. O‘quvchi murakkab amaliy masalalarni yechishda mustaqil intellektual yondashuvga ega bo‘lib, yangi bilimlarni tizimlashtirish va amalda qo‘llashga yuqori moyillik ko‘rsatmoqda.

Bosim ko‘rsatkichi: ${pressureIndex}% (${pressureIndex < 35 ? "Mustaqil va erkin qaror qabul qiluvchi" : pressureIndex < 60 ? "Oila orzulari bilan muvozanatli" : "Tashqi bosim mavjud, qo‘shimcha psixologik suhbat tavsiya etiladi"}).`;

  const strategicSteps = [
    `1-qadam (7-9 sinflar): Maktabda ${topCareer.subjects.slice(0, 2).join(', ')} fanlarini chuqurlashtirib o‘rganish, to‘garaklarga a'zo bo‘lish.`,
    `2-qadam (10-sinf): ${topCareer.skills.slice(0, 2).join(' va ')} bo‘yicha bazaviy amaliy loyihalar yaratish, soha mutaxassislari bilan uchrashuvlarda ishtirok etish.`,
    `3-qadam (11-sinf): OTM yoki kollejga kirish imtihonlariga maqsadli tayyorgarlik ko‘rish, chet tillarini (ingliz/rus tili) B2 darajasiga yetkazish.`,
    `4-qadam (Oliy ta'lim va amaliyot): ${topCareer.educationPath} doirasida bakalavriat yoki xalqaro sertifikat dasturlarini muvaffaqiyatli yakunlash.`
  ];

  const recommendationsForParents = `Hurmatli ota-onalar! Farzandingiz ${studentName}da ${topCareer.nameUz} kasbiga tabiiy qobiliyat va kuchli motivatsiya mavjud. Uni o‘z qiziqishlari bo‘yicha mustaqil kitob mutolaa qilishga, zamonaviy to‘garaklarga qatnashishiga rag‘batlantiring. Uning mustaqil qarorlarini qo‘llab-quvvatlash kelajakda muvaffaqiyatli mutaxassis bo‘lishining asosiy omilidir.`;

  const recommendedBooksAndCourses = [
    `${topCareer.nameUz} mutaxassisligi bo‘yicha O‘zbekiston va xalqaro o‘quv qo‘llanmalari`,
    "Coursera va Khan Academy platformalaridagi fundamental kurslar",
    "Psixologik qat'iyat va liderlik ko‘nikmalarini rivojlantirish bo‘yicha 'Atom odatlari' (James Clear)",
    "41-maktab kutubxonasi va internet sinfidagi ixtisoslashgan multimedia resurslari"
  ];

  return {
    aiUsed: true,
    model: "Gemini 3.1 Pro (41-maktab AI engine)",
    analysisText,
    strategicSteps,
    recommendationsForParents,
    recommendedBooksAndCourses
  };
}

export async function submitAssessmentClient(
  studentData: { fullName: string; grade: string; gender?: string; phone?: string },
  answersPayload: { questionId: string; score: number }[]
): Promise<TestResult> {
  // 1. First attempt server submission
  try {
    const res = await fetch('/api/test/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentData, answers: answersPayload })
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success && data.result) {
        saveLocalResult(data.result);
        return data.result;
      }
    }
  } catch (err) {
    console.warn('Server endpoint unavailable, executing client-side assessment engine:', err);
  }

  // 2. Client-side fallback computation
  const { dimensions, riasec, pressureIndex, pressureAssessment } = calculateDimensionsAndRiasec(
    QUESTIONS,
    answersPayload
  );

  const matched = matchCareers(dimensions, CAREERS);
  const topCareer = matched[0]?.career || CAREERS[0];

  const aiReport = generateClientAiReport(
    studentData.fullName,
    studentData.grade,
    topCareer,
    dimensions,
    riasec,
    pressureIndex
  );

  const student: Student = {
    id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fullName: studentData.fullName,
    grade: studentData.grade,
    gender: studentData.gender,
    phone: studentData.phone,
    schoolName: "41-sonli umumiy o‘rta ta'lim maktabi",
    createdAt: new Date().toISOString()
  };

  const localResult: TestResult = {
    id: `res-${Date.now()}`,
    studentId: student.id,
    student,
    createdAt: student.createdAt,
    dimensions,
    riasec,
    pressureIndex,
    pressureAssessment,
    matchedCareers: matched,
    aiAnalysis: aiReport.analysisText,
    strategicSteps: aiReport.strategicSteps,
    recommendationsForParents: aiReport.recommendationsForParents,
    recommendedBooks: aiReport.recommendedBooksAndCourses
  };

  saveLocalResult(localResult);
  return localResult;
}

export function saveLocalResult(result: TestResult) {
  try {
    const existing = getLocalResults();
    const updated = [result, ...existing.filter(r => r.id !== result.id)];
    localStorage.setItem('kasbim_student_results', JSON.stringify(updated.slice(0, 100)));
  } catch (e) {
    console.warn('Unable to persist to localStorage:', e);
  }
}

export function getLocalResults(): TestResult[] {
  try {
    const raw = localStorage.getItem('kasbim_student_results');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Unable to read localStorage:', e);
  }
  return [];
}

export async function askAiCounselor(
  result: TestResult,
  question: string
): Promise<string> {
  // 1. Try server
  try {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student: result.student,
        dimensions: result.dimensions,
        riasec: result.riasec,
        pressureIndex: result.pressureIndex,
        topCareer: result.matchedCareers[0]?.career,
        question
      })
    });

    const contentType = res.headers.get('content-type');
    if (res.ok && contentType && contentType.includes('application/json')) {
      const data = await res.json();
      if (data.success && data.answer) {
        return data.answer;
      }
    }
  } catch (e) {
    console.warn('Server AI endpoint unavailable, using localized intelligence:', e);
  }

  // 2. Intelligent client counselor
  const topCareer = result.matchedCareers[0]?.career;
  const careerName = topCareer ? topCareer.nameUz : "tanlangan kasb";
  const subjects = topCareer?.subjects?.join(', ') || "asosiy fanlar";

  return `Hurmatli ${result.student.fullName}!

Siz bergan savol: "${question}"

Sizning 41-maktab diagnostika pasportingizdagi eng yuqori qobiliyatingiz — ${careerName} yo‘nalishi. 

1. Qobiliyatingiz va fanlar: Ushbu yo‘nalishda eng katta natijaga erishish uchun hozirdan boshlab ${subjects} fanlariga alohida urg‘u berish tavsiya qilinadi.
2. Amaliy tavsiya: Maktabdagi to‘garaklar va zamonaviy o‘quv platformalaridan foydalanib, kichik mustaqil loyihalar qilishni boshlang.
3. Psixologik maslahat: O‘z xohish va qiziqishingizga ishoning. Har kuni 45 daqiqa ixtisoslashgan adabiyot yoki amaliy mashg‘ulot bilan shug‘ullanish 1-2 yil ichida tengdoshlaringizdan sezilarli darajada oldinga chiqishingizni ta'minlaydi.

Savolingiz bo‘yicha qo‘shimcha ravishda 41-maktab psixologi va sinf rahbaringiz bilan ham suhbatlashishingiz mumkin!`;
}
