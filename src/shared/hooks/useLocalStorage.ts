import { useEffect, useState } from "react";

import {
  loadFromStorage,
  saveToStorage,
} from "../utils/storage";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
) {
  const [value, setValue] = useState<T>(() =>
    loadFromStorage(key, initialValue),
  );

  useEffect(() => {
    saveToStorage(key, value);
  }, [key, value]);

  return [value, setValue] as const;
}