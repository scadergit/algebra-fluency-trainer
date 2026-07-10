import { useCallback, useEffect, useState } from "react";

import {
  loadFromStorage,
  saveToStorage,
} from "../utils/storage";

/**
 * Like useState, but persisted to localStorage.
 *
 * All components that use the same key stay in sync: when one instance
 * writes a new value the others pick it up via the "storage" event
 * (which fires for cross-tab writes) and a custom "local-storage" event
 * (which we dispatch for same-tab writes).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
) {
  const [value, setValueState] = useState<T>(() =>
    loadFromStorage(key, initialValue),
  );

  // Re-read from storage whenever the key changes (e.g. student switch)
  useEffect(() => {
    setValueState(loadFromStorage(key, initialValue));
  // initialValue is intentionally excluded — we only want to re-read on key change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Re-read from storage whenever another instance (same or different tab) writes
  useEffect(() => {
    function handleChange(e: Event) {
      // StorageEvent (cross-tab) carries the key; our custom event does too
      const storageKey =
        e instanceof StorageEvent
          ? e.key
          : (e as CustomEvent<{ key: string }>).detail?.key;

      if (storageKey !== key) return;
      setValueState(loadFromStorage(key, initialValue));
    }

    window.addEventListener("storage", handleChange);
    window.addEventListener("local-storage", handleChange as EventListener);

    return () => {
      window.removeEventListener("storage", handleChange);
      window.removeEventListener("local-storage", handleChange as EventListener);
    };
  }, [key, initialValue]);

  const setValue = useCallback(
    (action: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const next =
          typeof action === "function"
            ? (action as (prev: T) => T)(prev)
            : action;

        saveToStorage(key, next);

        // Notify other same-tab consumers
        window.dispatchEvent(
          new CustomEvent("local-storage", { detail: { key } }),
        );

        return next;
      });
    },
    [key],
  );

  return [value, setValue] as const;
}
