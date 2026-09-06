import type { IncomingMessage, ServerResponse } from 'http';
import { QUESTIONS } from '../src/data/questions';
import { CAREERS } from '../src/data/careers';
import { calculateDimensionsAndRiasec, matchCareers, generateClientAiReport } from '../src/services/assessmentService';

type Req = IncomingMessage & {
  url?: string;
  method?: string;
  query?: Record<string, string | string[]>;
  body?: any;
};

type Res = ServerResponse & {
  status: (code: number) => Res;
  json: (data: any) => void;
  send: (data: any) => void;
  end: () => void;
};

export default async function handler(req: Req, res: Res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const url = req.url || '';

  // GET /api/questions
  if (url.includes('/questions')) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: true,
      count: QUESTIONS.length,
      questions: QUESTIONS
    }));
    return;
  }

  // GET /api/careers
  if (url.includes('/careers')) {
    const category = req.query?.category as string | undefined;
    const search = req.query?.search as string | undefined;

    let list = CAREERS;
    if (category && category !== 'All') {
      list = list.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.nameUz.toLowerCase().includes(q) ||
        c.descriptionUz.toLowerCase().includes(q)
      );
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      success: true,
      count: list.length,
      careers: list
    }));
    return;
  }

  // POST /api/test/submit
  if (url.includes('/test/submit') && req.method === 'POST') {
    const { studentData, answers } = req.body || {};
    if (!studentData || !answers) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Ma\'lumotlar to\'liq emas' }));
      return;
    }

    const { dimensions, riasec, pressureIndex, pressureAssessment } = calculateDimensionsAndRiasec(
      QUESTIONS,
      answers
    );
    const matchedCareers = matchCareers(dimensions, CAREERS);
    const topCareer = matchedCareers[0]?.career || CAREERS[0];
    const aiReport = generateClientAiReport(
      studentData.fullName,
      studentData.grade,
      topCareer,
      dimensions,
      riasec,
      pressureIndex
    );

    const nowIso = new Date().toISOString();
    const result = {
      id: `res-${Date.now()}`,
      studentId: `std-${Date.now()}`,
      student: {
        id: `std-${Date.now()}`,
        fullName: studentData.fullName,
        grade: studentData.grade,
        gender: studentData.gender,
        phone: studentData.phone,
        schoolName: "41-sonli umumiy o‘rta ta'lim maktabi",
        createdAt: nowIso
      },
      createdAt: nowIso,
      date: new Date().toLocaleDateString('uz-UZ'),
      dimensions,
      riasec,
      pressureIndex,
      pressureAssessment,
      matchedCareers,
      aiAnalysis: aiReport.analysisText,
      strategicSteps: aiReport.strategicSteps,
      recommendationsForParents: aiReport.recommendationsForParents,
      recommendedBooks: aiReport.recommendedBooksAndCourses
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: true, result }));
    return;
  }

  // Health check
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    status: 'ok',
    platform: 'Vercel Serverless & 41-maktab Kasbim — Kelajagim',
    questionsCount: QUESTIONS.length,
    careersCount: CAREERS.length
  }));
}
