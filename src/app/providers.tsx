import type { ReactNode } from "react";

import { SettingsProvider } from "../features/settings/SettingsContext";
import { PracticeSessionProvider } from "../features/practice/session/PracticeSessionContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({
  children,
}: ProvidersProps) {
  return (
    <SettingsProvider>
      <PracticeSessionProvider>
        {children}
      </PracticeSessionProvider>
    </SettingsProvider>
  );
}