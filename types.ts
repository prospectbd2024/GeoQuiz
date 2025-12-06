export enum GameMode {
  CAPITALS = 'Capitals',
  FLAGS = 'Flags',
  CONTINENTS = 'Continents',
  CITIES = 'Cities',
  FEATURES = 'Geo Features',
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  emoji?: string; // For decoration
  countryCode?: string; // For fetching reliable flag images (ISO 2-letter code)
  explanation: string; // Fun fact explaining the answer
}

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  score: number;
  isFinished: boolean;
  isLoading: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

export interface GameTheme {
  bg: string;
  primary: string;
  secondary: string;
  accent: string;
  icon: string;
}