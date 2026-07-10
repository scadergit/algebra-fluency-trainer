import { Page } from "../../shared/components/Page";
import { useSessionHistory } from "../../shared/hooks/useSessionHistory";
import { SkillCard } from "./SkillCard";

import type { SkillStats } from "./SkillCard";
import type { SessionRecord } from "../../types/SessionRecord";

// ── Aggregate per-skill stats from all sessions ───────────────────────────────

function buildSkillStats(history: SessionRecord[]): SkillStats[] {
  // Work chronologically (history is stored newest-first)
  const sessions = [...history].reverse();

  // Collect all skill names
  const skillSet = new Set<string>();
  for (const r of sessions) {
    for (const s of r.skills) skillSet.add(s);
    if (r.avgResponseMsBySkill) {
      for (const s of Object.keys(r.avgResponseMsBySkill)) skillSet.add(s);
    }
    if (r.promptCountBySkill) {
      for (const s of Object.keys(r.promptCountBySkill)) skillSet.add(s);
    }
  }

  const skills = Array.from(skillSet).sort();

  return skills.map((skill, skillIndex) => {
    let totalCorrect = 0;
    let totalAttempted = 0;
    let totalPrompts = 0;
    let sessionCount = 0;
    const avgMsHistory: number[] = [];

    for (const r of sessions) {
      const wasActive = r.skills.includes(skill);
      if (!wasActive) continue;

      sessionCount += 1;

      const skillCount = r.skills.length;

      // ── Prompt count ──────────────────────────────────────────────────────
      const prompts = r.promptCountBySkill?.[skill];
      if (prompts !== undefined) {
        // New sessions: exact per-skill count
        totalPrompts += prompts;
      } else {
        // Old sessions: distribute session totals evenly across active skills
        const sessionTotal = r.correct + r.incorrect;
        totalPrompts += Math.round(sessionTotal / skillCount);
      }

      // ── Avg response time history ─────────────────────────────────────────
      const avgMs = r.avgResponseMsBySkill?.[skill];
      if (avgMs !== undefined) {
        avgMsHistory.push(avgMs);
      } else if (r.avgResponseMs !== undefined) {
        // Old sessions: use the overall avg as a proxy for each skill
        avgMsHistory.push(r.avgResponseMs);
      }

      // ── Correct / attempted ───────────────────────────────────────────────
      const skillCorrect = r.correctCountBySkill?.[skill];
      const skillAttempted = r.attemptedCountBySkill?.[skill];
      if (skillCorrect !== undefined && skillAttempted !== undefined) {
        // New sessions: exact per-skill counts
        totalCorrect += skillCorrect;
        totalAttempted += skillAttempted;
      } else if (skillCount === 1) {
        // Old single-skill session: all results belong to this skill
        totalCorrect += r.correct;
        totalAttempted += r.correct + r.incorrect;
      } else {
        // Old multi-skill session: distribute evenly (best approximation)
        totalCorrect += Math.round(r.correct / skillCount);
        totalAttempted += Math.round((r.correct + r.incorrect) / skillCount);
      }
    }

    return {
      skill,
      skillIndex,
      avgMsHistory,
      totalAttempted,
      totalCorrect,
      totalPrompts,
      sessionCount,
    };
  });
}

// ── StatisticsPage ────────────────────────────────────────────────────────────

export default function StatisticsPage() {
  const { history } = useSessionHistory();

  const skillStats = buildSkillStats(history);
  const hasData = skillStats.some((s) => s.sessionCount > 0);

  return (
    <Page title="Statistics">

      <div className="mb-6">
        <p className="text-sm text-slate-500">
          {history.length === 0
            ? "No timed sessions recorded yet."
            : `${history.length} session${history.length === 1 ? "" : "s"} recorded`}
        </p>
      </div>

      {!hasData ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-500">
            Complete a timed practice session to see your skill stats here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skillStats
            .filter((s) => s.sessionCount > 0)
            .map((stats) => (
              <SkillCard key={stats.skill} stats={stats} />
            ))}
        </div>
      )}

    </Page>
  );
}
