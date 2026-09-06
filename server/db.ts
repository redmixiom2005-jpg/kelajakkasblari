import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { SEED_QUESTIONS } from './seedData';
import { ALL_CAREERS } from './careers';
import { Career, Question, Student, TestResult, User } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseState {
  users: User[];
  questions: Question[];
  careers: Career[];
  students: Student[];
  results: TestResult[];
}

function getInitialState(): DatabaseState {
  const adminPasswordHash = bcrypt.hashSync('admin41!', 10);
  const teacherPasswordHash = bcrypt.hashSync('ustoz41!', 10);

  const initialUsers: User[] = [
    {
      id: 'usr-admin-1',
      username: 'admin',
      passwordHash: adminPasswordHash,
      fullName: 'Maktab Ma\'muri (Admin)',
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-teacher-1',
      username: 'pedagog',
      passwordHash: teacherPasswordHash,
      fullName: 'Maktab Amaliyotchi Psixologi',
      role: 'TEACHER',
      createdAt: new Date().toISOString()
    }
  ];

  const questions: Question[] = SEED_QUESTIONS.map(q => ({
    id: q.id,
    orderNumber: q.orderNumber,
    questionUz: q.questionUz,
    questionKrill: q.questionKrill,
    questionRu: q.questionRu,
    questionEn: q.questionEn,
    category: q.category,
    active: q.active,
    weightTech: q.weightTech,
    weightMed: q.weightMed,
    weightEng: q.weightEng,
    weightSoc: q.weightSoc,
    weightCre: q.weightCre,
    weightBus: q.weightBus,
    weightNat: q.weightNat,
    weightLaw: q.weightLaw,
    correlatedSubject: q.correlatedSubject,
    correlatedTrait: q.correlatedTrait,
    isPressureCheck: q.isPressureCheck
  }));

  return {
    users: initialUsers,
    questions,
    careers: ALL_CAREERS,
    students: [],
    results: []
  };
}

class Database {
  private state: DatabaseState;

  constructor() {
    this.state = this.load();
  }

  private load(): DatabaseState {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        // Ensure careers & questions are up-to-date with latest 200+ list
        if (!parsed.careers || parsed.careers.length < ALL_CAREERS.length) {
          parsed.careers = ALL_CAREERS;
        }
        if (!parsed.questions || parsed.questions.length < SEED_QUESTIONS.length) {
          parsed.questions = SEED_QUESTIONS;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not read existing db.json, initializing fresh store:', e);
    }
    const initial = getInitialState();
    this.saveDirect(initial);
    return initial;
  }

  private saveDirect(state: DatabaseState) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  public save() {
    this.saveDirect(this.state);
  }

  public getUsers(): User[] {
    return this.state.users;
  }

  public findUserByUsername(username: string): User | undefined {
    return this.state.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  }

  public getQuestions(): Question[] {
    return this.state.questions.filter(q => q.active);
  }

  public getCareers(): Career[] {
    return this.state.careers.filter(c => c.active);
  }

  public getCareerById(id: string): Career | undefined {
    return this.state.careers.find(c => c.id === id || c.slug === id);
  }

  public getStudents(): Student[] {
    return this.state.students;
  }

  public addStudent(student: Student): Student {
    this.state.students.push(student);
    this.save();
    return student;
  }

  public findStudentById(id: string): Student | undefined {
    return this.state.students.find(s => s.id === id);
  }

  public getResults(): TestResult[] {
    return this.state.results;
  }

  public getResultById(id: string): TestResult | undefined {
    return this.state.results.find(r => r.id === id);
  }

  public addResult(result: TestResult): TestResult {
    this.state.results.push(result);
    this.save();
    return result;
  }

  public updateResult(id: string, partial: Partial<TestResult>): TestResult | undefined {
    const idx = this.state.results.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.state.results[idx] = { ...this.state.results[idx], ...partial };
      this.save();
      return this.state.results[idx];
    }
    return undefined;
  }
}

export const db = new Database();
