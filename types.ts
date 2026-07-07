export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  subject?: string;
  isQuiz?: boolean;
  quizData?: QuizQuestion[];
  isFlashcardSet?: boolean;
  flashcards?: Flashcard[];
}

export interface StudySubject {
  id: string;
  name: string;
  icon: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  defaultQuestions: string[];
}

export interface StudyPlanItem {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  userSelectedAnswerIndex?: number;
}
