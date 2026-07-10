import { useEffect } from "react";

import { Card } from "../../../shared/components/Card";
import { Button } from "../../../shared/components/Button";

interface SessionSummaryProps {
  correct: number;
  incorrect: number;
  bestStreak: number;
  durationSeconds: number;
  /** Average milliseconds per attempted question */
  avgResponseMs?: number;
  onRestart(): void;
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-slate-600">
        {label}
      </span>
      <span className="text-2xl font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}

function formatAvgTime(ms: number): string {
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export function SessionSummary({
  correct,
  incorrect,
  bestStreak,
  durationSeconds,
  avgResponseMs,
  onRestart,
}: SessionSummaryProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") onRestart();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onRestart]);

  const attempted = correct + incorrect;
  const accuracy =
    attempted > 0
      ? `${Math.round((correct / attempted) * 100)}%`
      : "—";

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const duration =
    minutes > 0
      ? `${minutes}m ${seconds}s`
      : `${seconds}s`;

  return (
    <Card>
      <h2 className="mb-6 text-2xl font-bold text-slate-800">
        Time's Up!
      </h2>

      <SummaryRow label="Duration" value={duration} />
      <SummaryRow label="Correct" value={correct} />
      <SummaryRow label="Incorrect" value={incorrect} />
      <SummaryRow label="Accuracy" value={accuracy} />
      <SummaryRow label="🏆 Best Streak" value={bestStreak} />
      {avgResponseMs !== undefined && (
        <SummaryRow
          label="⏱ Avg Response"
          value={formatAvgTime(avgResponseMs)}
        />
      )}

      <div className="mt-6">
        <Button onClick={onRestart}>
          Practice Again
        </Button>
      </div>
    </Card>
  );
}
