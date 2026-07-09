export interface PracticeOperations {
  addition: boolean;
  subtraction: boolean;
  multiplication: boolean;
  division: boolean;
}

export interface AppSettings {
  maxNumber: number;

  allowNegativeNumbers: boolean;
  allowNegativeAnswers: boolean;

  allowFractions: boolean;
  allowDecimals: boolean;

  operations: PracticeOperations;
}