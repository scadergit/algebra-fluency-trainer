import { skills } from "./index";

export function getSkill(id: string) {
  return skills.find((skill) => skill.id === id);
}

export function getEnabledSkills(ids: string[]) {
  return ids
    .map(getSkill)
    .filter(
      (skill): skill is NonNullable<typeof skill> =>
        skill !== undefined,
    );
}