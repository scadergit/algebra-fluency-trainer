export function loadFromStorage<T>(
  key: string,
  fallback: T,
): T {
  const value = localStorage.getItem(key);

  if (value === null) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(
  key: string,
  value: T,
): void {
  localStorage.setItem(
    key,
    JSON.stringify(value),
  );
}