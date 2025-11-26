export interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  documentation_url?: string;
}

export interface QuizData {
  [key: string]: Question[];
}
