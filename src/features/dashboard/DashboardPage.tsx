import { useNavigate } from "react-router-dom";

import { Card } from "../../shared/components/Card";
import { Button } from "../../shared/components/Button";
import { Page } from "../../shared/components/Page";

import { useSessionHistory } from "../../shared/hooks/useSessionHistory";
import { useSettings } from "../settings/SettingsContext";

import type { SessionRecord } from "../../types/SessionRecord";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isWithinDays(iso: string, days: number): boolean {
  const d = new Date(iso);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return d >= cutoff;
}

function totalCorrect(records: SessionRecord[]): number {
  return records.reduce((sum, r) => sum + r.correct, 0);
}

function totalAttempted(records: SessionRecord[]): number {
  return records.reduce(
    (sum, r) => sum + r.correct + r.incorrect,
    0,
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

function formatSkills(skills: string[]): string {
  if (skills.length === 0) return "—";
  const names = skills.map(
    (s) => s.charAt(0).toUpperCase() + s.slice(1),
  );
  if (names.length <= 2) return names.join(" & ");
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-3xl font-bold text-slate-800">
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-xs text-slate-400">
          {sub}
        </div>
      )}
    </div>
  );
}

function RecentRow({ record }: { record: SessionRecord }) {
  const attempted = record.correct + record.incorrect;
  const acc =
    attempted > 0
      ? `${Math.round((record.correct / attempted) * 100)}%`
      : "—";

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
      <td className="py-2.5 pr-4 text-sm text-slate-500">
        {formatTime(record.completedAt)}
      </td>
      <td className="py-2.5 pr-4 text-sm font-medium text-slate-700">
        {formatDuration(record.durationSeconds)}
      </td>
      <td className="py-2.5 pr-4 text-sm text-slate-600">
        {formatSkills(record.skills)}
      </td>
      <td className="py-2.5 pr-4 text-center text-sm font-semibold text-green-700">
        {record.correct}
      </td>
      <td className="py-2.5 text-center text-sm font-semibold text-slate-700">
        {acc}
      </td>
    </tr>
  );
}

// ── DashboardPage ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { history } = useSessionHistory();
  const { settings } = useSettings();

  const todaySessions = history.filter((r) =>
    isToday(r.completedAt),
  );
  const weekSessions = history.filter((r) =>
    isWithinDays(r.completedAt, 7),
  );

  const todayCorrect = totalCorrect(todaySessions);
  const weekCorrect = totalCorrect(weekSessions);
  const weekAttempted = totalAttempted(weekSessions);
  const weekAccuracy =
    weekAttempted > 0
      ? `${Math.round((weekCorrect / weekAttempted) * 100)}%`
      : "—";

  const bestStreak =
    history.length > 0
      ? Math.max(...history.map((r) => r.bestStreak))
      : 0;

  const activeSkills = formatSkills(settings.enabledSkills);

  return (
    <Page title="Dashboard">

      {/* Quick-start */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-indigo-600 px-6 py-5 text-white shadow">
        <div>
          <div className="text-lg font-semibold">
            Ready to practice?
          </div>
          <div className="mt-0.5 text-sm text-indigo-200">
            {activeSkills}
          </div>
        </div>
        <Button
          onClick={() => navigate("/practice")}
        >
          Start Practice →
        </Button>
      </div>

      {/* Summary stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Today's Sessions"
          value={todaySessions.length}
        />
        <StatCard
          label="Correct Today"
          value={todayCorrect}
        />
        <StatCard
          label="This Week"
          value={weekCorrect}
          sub={`${weekSessions.length} session${weekSessions.length === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Week Accuracy"
          value={weekAccuracy}
          sub={bestStreak > 0 ? `🏆 Best streak: ${bestStreak}` : undefined}
        />
      </div>

      {/* Today's sessions table */}
      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">
          Today's Sessions
        </h2>

        {todaySessions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No timed sessions yet today. Start a practice session to see results here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Time
                  </th>
                  <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Duration
                  </th>
                  <th className="pb-2 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Topics
                  </th>
                  <th className="pb-2 pr-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    ✅
                  </th>
                  <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Acc.
                  </th>
                </tr>
              </thead>
              <tbody>
                {todaySessions.map((record, i) => (
                  <RecentRow
                    key={`${record.completedAt}-${i}`}
                    record={record}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

    </Page>
  );
}
