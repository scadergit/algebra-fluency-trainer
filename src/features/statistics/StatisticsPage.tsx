import { Card } from "../../shared/components/Card";
import { Page } from "../../shared/components/Page";

import { usePracticeSession } from "../practice/session/PracticeSessionContext";

function StatRow({
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
      <span className="text-xl font-bold text-slate-800">
        {value}
      </span>
    </div>
  );
}

export default function StatisticsPage() {
  const {
    correct,
    attempted,
    skipped,
    currentStreak,
    bestStreak,
  } = usePracticeSession();

  const incorrect = attempted - correct;
  const accuracy =
    attempted > 0
      ? Math.round((correct / attempted) * 100)
      : 0;

  return (
    <Page title="Statistics">

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-slate-700">
          Current Session
        </h2>

        <StatRow label="Correct" value={correct} />
        <StatRow label="Incorrect" value={incorrect} />
        <StatRow label="Skipped" value={skipped} />
        <StatRow label="Attempted" value={attempted} />
        <StatRow
          label="Accuracy"
          value={attempted > 0 ? `${accuracy}%` : "—"}
        />
        <StatRow
          label="Current Streak"
          value={`🔥 ${currentStreak}`}
        />
        <StatRow
          label="Best Streak"
          value={`🏆 ${bestStreak}`}
        />
      </Card>

    </Page>
  );
}
