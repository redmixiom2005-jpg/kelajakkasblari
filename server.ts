import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { calculateAssessment } from './server/scoring';
import { generateDeepCareerCounseling } from './server/ai';
import { Student, TestResult } from './src/types';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'kasbim-kelajagim-uychi-41-secret-2026';

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger in dev
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      school: 'Namangan viloyati, Uychi tumani, 41-sonli umumiy o‘rta ta\'lim maktabi',
      app: 'Kasbim — Kelajagim'
    });
  });

  // Questions endpoint
  app.get('/api/questions', (req, res) => {
    const questions = db.getQuestions();
    res.json({ success: true, count: questions.length, questions });
  });

  // Careers list endpoint (supports query search and filter)
  app.get('/api/careers', (req, res) => {
    const { category, search } = req.query;
    let careers = db.getCareers();

    if (category && typeof category === 'string' && category !== 'All') {
      careers = careers.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      careers = careers.filter(c =>
        c.nameUz.toLowerCase().includes(q) ||
        c.nameKrill.toLowerCase().includes(q) ||
        c.nameRu.toLowerCase().includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.descriptionUz.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: careers.length, careers });
  });

  // Single career detail
  app.get('/api/careers/:id', (req, res) => {
    const career = db.getCareerById(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, error: 'Career not found' });
    }
    res.json({ success: true, career });
  });

  // Submit test assessment
  app.post('/api/test/submit', async (req, res) => {
    try {
      const { studentData, answers } = req.body;

      if (!studentData || !studentData.fullName || !studentData.grade) {
        return res.status(400).json({ success: false, error: 'Student full name and grade are required' });
      }

      if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ success: false, error: 'Test answers are required' });
      }

      const questions = db.getQuestions();
      const careers = db.getCareers();

      // Register / store student
      const studentId = `std-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newStudent: Student = {
        id: studentId,
        fullName: studentData.fullName.trim(),
        grade: studentData.grade.trim(),
        gender: studentData.gender || 'Boshqa',
        phone: studentData.phone ? studentData.phone.trim() : undefined,
        schoolName: '41-sonli umumiy o‘rta ta\'lim maktabi, Uychi tumani, Namangan viloyati',
        createdAt: new Date().toISOString()
      };
      db.addStudent(newStudent);

      // Calculate psychometric scoring
      const assessment = calculateAssessment(questions, answers, careers);

      const topCareer = assessment.matchedCareers[0]?.career || careers[0];

      // Generate deep initial counseling report
      const counselingReport = await generateDeepCareerCounseling({
        student: newStudent,
        dimensions: assessment.dimensions,
        riasec: assessment.riasec,
        pressureIndex: assessment.pressureIndex,
        topCareer
      });

      const resultId = `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const result: TestResult = {
        id: resultId,
        studentId: newStudent.id,
        student: newStudent,
        createdAt: new Date().toISOString(),
        dimensions: assessment.dimensions,
        riasec: assessment.riasec,
        pressureIndex: assessment.pressureIndex,
        pressureAssessment: assessment.pressureAssessment,
        matchedCareers: assessment.matchedCareers.map(m => ({
          careerId: m.career.id,
          career: m.career,
          matchPercentage: m.matchPercentage
        })),
        aiAnalysis: counselingReport.analysisText,
        aiModel: counselingReport.model,
        strategicSteps: counselingReport.strategicSteps,
        recommendationsForParents: counselingReport.recommendationsForParents,
        recommendedBooks: counselingReport.recommendedBooksAndCourses
      };

      db.addResult(result);

      res.json({
        success: true,
        resultId: result.id,
        result
      });
    } catch (err: any) {
      console.error('Error submitting assessment:', err);
      res.status(500).json({ success: false, error: err.message || 'Server error' });
    }
  });

  // Get test result by ID
  app.get('/api/results/:id', (req, res) => {
    const result = db.getResultById(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, error: 'Result not found' });
    }
    res.json({ success: true, result });
  });

  // High Thinking AI Consultation endpoint (for complex interactive queries)
  app.post('/api/ai/deep-analysis', async (req, res) => {
    try {
      const { resultId, customQuestion } = req.body;
      const result = db.getResultById(resultId);
      if (!result) {
        return res.status(404).json({ success: false, error: 'Result record not found' });
      }

      const topCareer = result.matchedCareers[0]?.career;
      const report = await generateDeepCareerCounseling({
        student: result.student,
        dimensions: result.dimensions,
        riasec: result.riasec,
        pressureIndex: result.pressureIndex,
        topCareer,
        customQuestion
      });

      // Update stored record
      db.updateResult(resultId, {
        aiAnalysis: report.analysisText,
        aiModel: report.model,
        strategicSteps: report.strategicSteps,
        recommendationsForParents: report.recommendationsForParents
      });

      res.json({ success: true, report });
    } catch (err: any) {
      console.error('Deep AI analysis error:', err);
      res.status(500).json({ success: false, error: err.message || 'AI generation failed' });
    }
  });

  // Admin / Teacher login
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    const user = db.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Foydalanuvchi topilmadi' });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: 'Noto‘g‘ri parol' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role, fullName: user.fullName },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role
      }
    });
  });

  // Admin middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Ruxsat berilmagan (Token topilmadi)' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({ success: false, error: 'Yaroqsiz token' });
    }
  };

  // School-wide analytics stats
  app.get('/api/admin/stats', requireAuth, (req, res) => {
    const students = db.getStudents();
    const results = db.getResults();

    // Grade breakdown
    const gradeCounts: Record<string, number> = {};
    students.forEach(s => {
      gradeCounts[s.grade] = (gradeCounts[s.grade] || 0) + 1;
    });

    // Top categories
    const categoryCounts: Record<string, number> = {};
    results.forEach(r => {
      const topC = r.matchedCareers[0]?.career?.category || 'Other';
      categoryCounts[topC] = (categoryCounts[topC] || 0) + 1;
    });

    // Average dimensions
    const avgDimensions = {
      tech: 0, med: 0, eng: 0, soc: 0, cre: 0, bus: 0, nat: 0, law: 0
    };
    if (results.length > 0) {
      results.forEach(r => {
        avgDimensions.tech += r.dimensions.tech;
        avgDimensions.med += r.dimensions.med;
        avgDimensions.eng += r.dimensions.eng;
        avgDimensions.soc += r.dimensions.soc;
        avgDimensions.cre += r.dimensions.cre;
        avgDimensions.bus += r.dimensions.bus;
        avgDimensions.nat += r.dimensions.nat;
        avgDimensions.law += r.dimensions.law;
      });
      Object.keys(avgDimensions).forEach(k => {
        (avgDimensions as any)[k] = Math.round((avgDimensions as any)[k] / results.length);
      });
    }

    res.json({
      success: true,
      totalStudents: students.length,
      totalTests: results.length,
      gradeCounts,
      categoryCounts,
      avgDimensions,
      recentResults: results.slice(-10).reverse()
    });
  });

  // Admin list all students with results
  app.get('/api/admin/students', requireAuth, (req, res) => {
    const results = db.getResults();
    res.json({ success: true, count: results.length, results });
  });

  // Export CSV data
  app.get('/api/admin/export', requireAuth, (req, res) => {
    const results = db.getResults();
    let csv = 'ID,FIO,Sinf,Top Kasb,Kategoriya,RIASEC,Bosim Indeksi,Sana\n';
    results.forEach(r => {
      const topCareer = r.matchedCareers[0]?.career?.nameUz || '';
      const cat = r.matchedCareers[0]?.career?.category || '';
      csv += `"${r.id}","${r.student.fullName}","${r.student.grade}","${topCareer}","${cat}","${r.riasec.primaryCode}","${r.pressureIndex}%","${new Date(r.createdAt).toLocaleDateString()}"\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=41-maktab-kasb-tahlili.csv');
    res.send(csv);
  });

  // Vite middleware for client SPA in dev / static in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
