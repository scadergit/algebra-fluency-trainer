import {
  createContext,
  useContext,
} from "react";

import type { ReactNode } from "react";

import { useLocalStorage } from "../../shared/hooks/useLocalStorage";

import type { AppSettings } from "../../shared/types/settings";

interface SettingsContextValue {
  settings: AppSettings;
  setSettings: React.Dispatch<
    React.SetStateAction<AppSettings>
  >;
}

const defaultSettings: AppSettings = {
  maxNumber: 9,
  allowNegatives: false,
  allowFractions: false,
  allowDecimals: false,
};

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
  const [settings, setSettings] =
    useLocalStorage<AppSettings>(
      "settings",
      defaultSettings,
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