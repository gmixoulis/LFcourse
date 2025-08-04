export interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface QuizData {
  [key: string]: Question[];
}
