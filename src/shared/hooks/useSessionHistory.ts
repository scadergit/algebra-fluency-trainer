import { useLocalStorage } from "./useLocalStorage";

import type { SessionRecord } from "../../types/SessionRecord";

const STORAGE_KEY = "session-history";
const MAX_RECORDS = 200;

export function useSessionHistory() {
  const [history, setHistory] =
    useLocalStorage<SessionRecord[]>(
      STORAGE_KEY,
      [],
    );

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
