import { generateAddition } from "../generators/addition";
import { generateDivision } from "../generators/division";
import { generateMultiplication } from "../generators/multiplication";
import { generateSubtraction } from "../generators/subtraction";

export const arithmeticSkills = [
  {
    id: "addition",
    title: "Addition",
    category: "Arithmetic",
    generate: generateAddition,
  },
  {
    id: "subtraction",
    title: "Subtraction",
    category: "Arithmetic",
    generate: generateSubtraction,
  },
  {
    id: "multiplication",
    title: "Multiplication",
    category: "Arithmetic",
    generate: generateMultiplication,
  },
  {
    id: "division",
    title: "Division",
    category: "Arithmetic",
    generate: generateDivision,
  },
];