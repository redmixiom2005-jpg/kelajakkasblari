export type Language = 'uz' | 'krill' | 'ru' | 'en';

export type UserRole = 'ADMIN' | 'TEACHER';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  passwordHash?: string;
  createdAt: string;
}

export interface LearningStage {
  period: string;
  title: string;
  items: string[];
}

export interface CareerLearningPath {
  stage1: LearningStage;
  stage2: LearningStage;
  stage3: LearningStage;
  stage4: LearningStage;
}

export interface Career {
  id: string;
  slug: string;
  nameUz: string;
  nameKrill: string;
  nameRu: string;
  nameEn: string;
  category: string;
  imageUrl: string;
  descriptionUz: string;
  descriptionKrill: string;
  descriptionRu: string;
  descriptionEn: string;
  skills: string[];
  subjects: string[];
  learningPath: CareerLearningPath;
  educationPath: string;
  futureOutlook: string;
  relatedCareers: string[];
  weightTech: number;
  weightMed: number;
  weightEng: number;
  weightSoc: number;
  weightCre: number;
  weightBus: number;
  weightNat: number;
  weightLaw: number;
  active: boolean;
}

export interface Question {
  id: string;
  orderNumber: number;
  questionUz: string;
  questionKrill: string;
  questionRu: string;
  questionEn: string;
  category: string;
  active: boolean;
  weightTech: number;
  weightMed: number;
  weightEng: number;
  weightSoc: number;
  weightCre: number;
  weightBus: number;
  weightNat: number;
  weightLaw: number;
  correlatedSubject?: string;
  correlatedTrait?: string;
  isPressureCheck?: boolean;
}

export interface Student {
  id: string;
  fullName: string;
  grade: string; // e.g. "9-A", "10-B", "11-A"
  gender?: string;
  phone?: string;
  schoolName: string;
  createdAt: string;
}

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
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
  primaryCode: string;
}

export interface MatchedCareerItem {
  careerId: string;
  career: Career;
  matchPercentage: number;
}

export interface TestResult {
  id: string;
  studentId: string;
  student: Student;
  createdAt: string;
  dimensions: DimensionScores;
  riasec: RIASECScores;
  pressureIndex: number;
  pressureAssessment: string;
  matchedCareers: MatchedCareerItem[];
  aiAnalysis?: string;
  aiModel?: string;
  strategicSteps?: string[];
  recommendationsForParents?: string;
  recommendedBooks?: string[];
}
