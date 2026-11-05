export interface QuestionOption {
  label: string;
  score: number;
}

export interface Question {
  id: number;
  prompt: string;
  options: QuestionOption[];
}

export interface ScoreBand {
  min: number;
  max: number;
  label: string;
  level: 'low' | 'moderate' | 'elevated' | 'high';
  headline: string;
  description: string;
  symptomsList: string[];
  recommendations: string[];
  referralAction: string;
}

export interface PsychologicalTest {
  id: string;
  title: string;
  shortTitle: string;
  badge: string;
  description: string;
  clinicalReference: string;
  estimatedMinutes: number;
  totalQuestions: number;
  questions: Question[];
  scoreBands: ScoreBand[];
}

export interface ArticleSection {
  heading: string;
  text: string;
  keyPoints?: string[];
}

export interface Article {
  id: string;
  title: string;
  category: 'Regulasi Emosi' | 'Hubungan & Relasi' | 'Self-Compassion' | 'Karir & Akademik' | 'Panduan Konseling';
  readTime: string;
  publishedDate: string;
  excerpt: string;
  intro: string;
  sections: ArticleSection[];
  conclusion: string;
  takeawayMessage: string;
  author: {
    name: string;
    role: string;
    sipp: string;
  };
}

export interface CounselingService {
  id: string;
  title: string;
  subtitle: string;
  format: 'Daring (Online)' | 'Tatap Muka (Offline)' | 'Daring & Tatap Muka';
  duration: string;
  description: string;
  targetAudience: string;
  outcomes: string[];
  priceInfo: string;
  isPopular?: boolean;
}

export interface Psychologist {
  id: string;
  name: string;
  title: string;
  sipp: string;
  himpsiNumber: string;
  bio: string;
  specializations: string[];
  therapeuticApproach: string[];
  schedule: string;
  experienceYears: number;
  consultationTypes: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'Pendaftaran' | 'Kerahasiaan' | 'Sesi Konseling' | 'Biaya';
}

export interface MoodCheck {
  id: string;
  label: string;
  emoji: string;
  reflection: string;
  suggestedAction: string;
}
