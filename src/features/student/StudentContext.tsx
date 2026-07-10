/**
 * StudentContext
 *
 * Tracks the currently active student name and the list of all students
 * who have session history stored locally.
 *
 * Each student has a secret word stored locally. New students set one on
 * first login; returning students must provide it to access their profile.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { loadFromStorage, saveToStorage } from "../../shared/utils/storage";

const ACTIVE_STUDENT_KEY = "active-student";
const STUDENT_LIST_KEY = "student-list";
const STUDENT_SECRETS_KEY = "student-secrets";

interface StudentContextValue {
  /** The currently active student name, or null if none selected */
  activeStudent: string | null;
  /** All student names that have ever been registered */
  knownStudents: string[];
  /**
   * Attempt to set the active student.
   * - New student (name not in knownStudents): registers them with the given secret.
   * - Returning student: verifies the secret matches; returns false if wrong.
   */
  loginStudent: (name: string, secret: string) => boolean;
  /** Returns true if the given name already has a registered secret */
  isKnownStudent: (name: string) => boolean;
  /** Clear the active student (go back to name entry) */
  clearActiveStudent: () => void;
  /** Teacher override: set (or reset) the secret for any student by name */
  setStudentSecret: (name: string, newSecret: string) => void;
  /** Teacher override: switch the active student without requiring their secret */
  loginStudentAsTeacher: (name: string) => void;
}

const StudentContext = createContext<StudentContextValue | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
  const [activeStudent, setActiveStudentState] = useState<string | null>(() =>
    loadFromStorage<string | null>(ACTIVE_STUDENT_KEY, null),
  );

  const [knownStudents, setKnownStudents] = useState<string[]>(() =>
    loadFromStorage<string[]>(STUDENT_LIST_KEY, []),
  );

  // Map of studentName (lowercase) → secret word
  const [secrets, setSecrets] = useState<Record<string, string>>(() =>
    loadFromStorage<Record<string, string>>(STUDENT_SECRETS_KEY, {}),
  );

  // Persist active student whenever it changes
  useEffect(() => {
    saveToStorage(ACTIVE_STUDENT_KEY, activeStudent);
  }, [activeStudent]);

  const isKnownStudent = useCallback(
    (name: string) => {
      return knownStudents.includes(name.trim());
    },
    [knownStudents],
  );

  const loginStudent = useCallback(
    (name: string, secret: string): boolean => {
      const trimmedName = name.trim();
      const trimmedSecret = secret.trim();
      if (!trimmedName || !trimmedSecret) return false;

      const key = trimmedName.toLowerCase();
      const existing = secrets[key];

      if (existing !== undefined) {
        // Returning student — verify secret
        if (existing !== trimmedSecret) return false;
      } else {
        // New student — register secret
        const updatedSecrets = { ...secrets, [key]: trimmedSecret };
        setSecrets(updatedSecrets);
        saveToStorage(STUDENT_SECRETS_KEY, updatedSecrets);

        setKnownStudents((prev) => {
          if (prev.includes(trimmedName)) return prev;
          const next = [...prev, trimmedName].sort((a, b) =>
            a.localeCompare(b),
          );
          saveToStorage(STUDENT_LIST_KEY, next);
          return next;
        });
      }

      setActiveStudentState(trimmedName);
      return true;
    },
    [secrets],
  );

  const clearActiveStudent = useCallback(() => {
    setActiveStudentState(null);
    saveToStorage(ACTIVE_STUDENT_KEY, null);
  }, []);

  const loginStudentAsTeacher = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    setActiveStudentState(trimmedName);
    saveToStorage(ACTIVE_STUDENT_KEY, trimmedName);
  }, []);

  const setStudentSecret = useCallback(
    (name: string, newSecret: string) => {
      const trimmedName = name.trim();
      const trimmedSecret = newSecret.trim();
      if (!trimmedName || !trimmedSecret) return;
      const key = trimmedName.toLowerCase();
      const updatedSecrets = { ...secrets, [key]: trimmedSecret };
      setSecrets(updatedSecrets);
      saveToStorage(STUDENT_SECRETS_KEY, updatedSecrets);
    },
    [secrets],
  );

  return (
    <StudentContext.Provider
      value={{
        activeStudent,
        knownStudents,
        loginStudent,
        isKnownStudent,
        clearActiveStudent,
        setStudentSecret,
        loginStudentAsTeacher,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used inside StudentProvider");
  return ctx;
}
