import { Career, Question, TestResult } from '../src/types';

export interface DimensionScores {
  tech: number;
  med: number;
  eng: number;
  soc: number;
  cre: number;
  bus: number;
  nat: number;
  law: number;
}

export interface RIASECScores {
  R: number; // Realistic
  I: number; // Investigative
  A: number; // Artistic
  S: number; // Social
  E: number; // Enterprising
  C: number; // Conventional
  primaryCode: string;
}

export function calculateAssessment(
  questions: Question[],
  answers: { questionId: string; score: number }[],
  careers: Career[]
): {
  dimensions: DimensionScores;
  riasec: RIASECScores;
  pressureIndex: number;
  pressureAssessment: string;
  matchedCareers: { career: Career; matchPercentage: number }[];
} {
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

  let rawPressure = 0;
  let maxPressure = 0;

  questions.forEach(q => {
    // Answers range from 1 to 5
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

  // Compute RIASEC Holland scores
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

  // Pressure evaluation
  const pressureIndex = maxPressure > 0 ? Math.round((rawPressure / maxPressure) * 100) : 25;
  let pressureAssessment = "Mustaqil va erkin tanlov: O‘quvchi o‘z shaxsiy xohish-irodasi bilan kasb tanlamoqda.";
  if (pressureIndex >= 60) {
    pressureAssessment = "Diqqat! Oila yoki atrof-muhit bosimi sezilarli darajada yuqori. Psixolog bilan alohida suhbat tavsiya etiladi.";
  } else if (pressureIndex >= 35) {
    pressureAssessment = "O‘rtacha tashqi ta'sir: Ota-ona yoki yaqinlarning orzulari o‘quvchining o‘z qiziqishlari bilan qisman to‘qnashmoqda.";
  }

  // Vector matching with careers
  const scoredCareers = careers.map(c => {
    // Compute distance / cosine similarity between student dimensions and career weights
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
      // Scale cosine to realistic 60% - 99% range
      matchPercentage = Math.min(99, Math.max(55, Math.round(cosine * 100)));
    }

    return { career: c, matchPercentage };
  });

  // Sort descending by match percentage
  scoredCareers.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    dimensions,
    riasec,
    pressureIndex,
    pressureAssessment,
    matchedCareers: scoredCareers.slice(0, 10)
  };
}
