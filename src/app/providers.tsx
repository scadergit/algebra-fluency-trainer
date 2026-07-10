import type { ReactNode } from "react";

import { SettingsProvider } from "../features/settings/SettingsContext";
import { PracticeSessionProvider } from "../features/practice/session/PracticeSessionContext";
import { StudentProvider } from "../features/student/StudentContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({
  children,
}: ProvidersProps) {
  return (
    <StudentProvider>
      <SettingsProvider>
        <PracticeSessionProvider>
          {children}
        </PracticeSessionProvider>
      </SettingsProvider>
    </StudentProvider>
  );
}
