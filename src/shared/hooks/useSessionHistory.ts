import { useLocalStorage } from "./useLocalStorage";
import { useStudent } from "../../features/student/StudentContext";

import type { SessionRecord } from "../../types/SessionRecord";

const MAX_RECORDS = 200;

/** Returns the localStorage key for a given student name. */
export function studentHistoryKey(student: string): string {
  return `session-history:${student.toLowerCase().trim()}`;
}

export function useSessionHistory() {
  const { activeStudent } = useStudent();

  // Fall back to a generic key when no student is active (shouldn't normally
  // happen, but keeps the hook safe to call anywhere).
  const key = activeStudent
    ? studentHistoryKey(activeStudent)
    : "session-history";

  const [history, setHistory] =
    useLocalStorage<SessionRecord[]>(key, []);

  function addRecord(record: SessionRecord) {
    setHistory((prev) => {
      const next = [record, ...prev];
      return next.slice(0, MAX_RECORDS);
    });
  }

  function clearHistory() {
    setHistory([]);
  }

  return { history, addRecord, clearHistory };
}
