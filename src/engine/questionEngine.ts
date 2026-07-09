import type { AppSettings } from "../shared/types/settings";

import { getEnabledSkills } from "./skills/registry";

export function generateQuestion(
  settings: AppSettings,
) {
  const enabledSkills = getEnabledSkills(
    settings.enabledSkills,
  );

  const index = Math.floor(
    Math.random() * enabledSkills.length,
  );

  return enabledSkills[index].generate(settings);
}