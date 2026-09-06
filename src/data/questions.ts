import { Question } from '../types';
import { SEED_QUESTIONS } from '../../server/seedData';

export const QUESTIONS: Question[] = SEED_QUESTIONS.map(q => ({
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
