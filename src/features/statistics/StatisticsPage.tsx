import { Card } from "../../shared/components/Card";
import { Page } from "../../shared/components/Page";

import { useSessionHistory } from "../../shared/hooks/useSessionHistory";

import type { SessionRecord } from "../../types/SessionRecord";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatSkills(skills: string[]): string {
  if (skills.length === 0) return "—";
  const names = skills.map((s) =>
    s.charAt(0).toUpperCase() + s.slice(1),
  );
  if (names.length <= 2) return names.join(" & ");
  return `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`;
}

function accuracy(record: SessionRecord): string {
  const attempted = record.correct + record.incorrect;
  if (attempted === 0) return "—";
  return `${Math.round((record.correct / attempted) * 100)}%`;
}

function formatAvgTime(ms: number | undefined): string {
  if (ms === undefined) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// ── Table row ─────────────────────────────────────────────────────────────────

function HistoryRow({ record }: { record: SessionRecord }) {
  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
      <td className="py-3 pr-4 text-sm text-slate-500 whitespace-nowrap">
        {formatDate(record.completedAt)}
        <span className="ml-2 text-slate-400">
          {formatTime(record.completedAt)}
        </span>
      </td>
      <td className="py-3 pr-4 text-sm font-medium text-slate-700 whitespace-nowrap">
        {formatDuration(record.durationSeconds)}
      </td>
      <td className="py-3 pr-4 text-sm text-slate-600">
        {formatSkills(record.skills)}
      </td>
      <td className="py-3 pr-4 text-center text-sm font-semibold text-green-700">
        {record.correct}
      </td>
      <td className="py-3 pr-4 text-center text-sm font-semibold text-red-600">
        {record.incorrect}
      </td>
      <td className="py-3 pr-4 text-center text-sm text-slate-500">
        {record.skipped}
      </td>
      <td className="py-3 pr-4 text-center text-sm font-semibold text-slate-700">
        {accuracy(record)}
      </td>
      <td className="py-3 pr-4 text-center text-sm text-slate-500">
        {record.bestStreak}
      </td>
      <td className="py-3 text-center text-sm text-slate-500">
        {formatAvgTime(record.avgResponseMs)}
      </td>
    </tr>
  );
}

// ── StatisticsPage ────────────────────────────────────────────────────────────

export default function StatisticsPage() {
  const { history, clearHistory } = useSessionHistory();

  return (
    <Page title="Statistics">

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {history.length === 0
            ? "No timed sessions recorded yet."
            : `${history.length} session${history.length === 1 ? "" : "s"} recorded`}
        </p>

        {history.length > 0 && (
          <button
            className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
            onClick={clearHistory}
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <Card>
          <p className="text-slate-500">
            Complete a timed practice session to see your history here.
          </p>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Date
                  </th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Duration
                  </th>
                  <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Topics
                  </th>
                  <th className="pb-3 pr-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    ✅
                  </th>
                  <th className="pb-3 pr-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    ❌
                  </th>
                  <th className="pb-3 pr-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Skip
                  </th>
                  <th className="pb-3 pr-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Acc.
                  </th>
                  <th className="pb-3 pr-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    🏆
                  </th>
                  <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                    ⏱ Avg
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((record, index) => (
                  <HistoryRow
                    key={`${record.completedAt}-${index}`}
                    record={record}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

    </Page>
  );
}
