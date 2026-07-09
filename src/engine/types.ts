export interface Question {
  id: string;
  topic: string;
  prompt: string;
  answer: string;
  explanation?: string;
  difficulty: number;
}