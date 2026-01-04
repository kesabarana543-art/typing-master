export type Language = 'english' | 'spanish' | 'code';
export type Difficulty = 'beginner' | 'intermediate' | 'expert';
export type Topic = 'story' | 'facts' | 'business' | 'nature' | 'technology';

export interface GameConfig {
  language: Language;
  difficulty: Difficulty;
  topic: Topic;
}

export interface LetterState {
  char: string;
  status: 'pending' | 'correct' | 'incorrect';
}

export interface GameStats {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  errors: number;
  totalChars: number;
  wpmHistory: { time: number; wpm: number }[];
}

export interface GeneratedContent {
  text: string;
  title: string;
}
