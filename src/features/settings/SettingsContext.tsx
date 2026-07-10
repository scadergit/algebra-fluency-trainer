import {
  createContext,
  useContext,
} from "react";

import type { ReactNode } from "react";

import { useLocalStorage } from "../../shared/hooks/useLocalStorage";
import { loadFromStorage } from "../../shared/utils/storage";
import { useStudent } from "../student/StudentContext";

import type { AppSettings } from "../../shared/types/settings";

interface SettingsContextValue {
  settings: AppSettings;
  setSettings: React.Dispatch<
    React.SetStateAction<AppSettings>
  >;
}

const defaultSettings: AppSettings = {
  maxNumber: 9,

  allowNegativeNumbers: false,

  allowFractions: false,
  allowDecimals: false,

  enabledSkills: [
    "addition",
    "subtraction",
    "multiplication",
    "division",
  ],
};

/** Returns the localStorage key for a given student's settings. */
function studentSettingsKey(student: string | null): string {
  if (!student) return "settings";
  return `settings:${student.toLowerCase().trim()}`;
}

const SettingsContext =
  createContext<SettingsContextValue | null>(
    null,
  );

interface SettingsProviderProps {
  children: ReactNode;
}

export function SettingsProvider({
  children,
}: SettingsProviderProps) {
  const { activeStudent } = useStudent();

  // New students inherit from the stored default settings (key "settings"),
  // falling back to the hardcoded defaults if none have been saved yet.
  const inheritedDefault: AppSettings =
    loadFromStorage<AppSettings>("settings", defaultSettings);

  const [settings, setSettings] =
    useLocalStorage<AppSettings>(
      studentSettingsKey(activeStudent),
      inheritedDefault,
    );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context =
    useContext(SettingsContext);

  if (context === null) {
    throw new Error(
      "useSettings must be used inside SettingsProvider",
    );
  }

  return context;
}
