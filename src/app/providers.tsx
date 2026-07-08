import type { ReactNode } from "react";

import { SettingsProvider } from "../features/settings/SettingsContext";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({
  children,
}: ProvidersProps) {
  return (
    <SettingsProvider>
      {children}
    </SettingsProvider>
  );
}