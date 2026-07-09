import { arithmeticSkills } from "./arithmetic";

import type { MathSkill } from "./MathSkill";

export function getEnabledSkills(
  enabledSkillIds: string[],
): MathSkill[] {
  if (enabledSkillIds.length === 0) {
    return arithmeticSkills;
  }

  return arithmeticSkills.filter((skill) =>
    enabledSkillIds.includes(skill.id),
  );
}