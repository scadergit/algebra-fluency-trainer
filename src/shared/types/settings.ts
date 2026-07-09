export type PracticeMode =
  | "mixed"
  | "addition"
  | "subtraction";

export interface AppSettings {
  maxNumber: number;

  allowNegativeNumbers: boolean;
  allowNegativeAnswers: boolean;

  allowFractions: boolean;
  allowDecimals: boolean;

  practiceMode: PracticeMode;
}