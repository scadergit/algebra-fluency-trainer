/**
 * SkillCard
 *
 * Displays aggregate statistics for a single skill across all sessions,
 * plus a small sparkline showing avg response-time trend over time.
 */

// ── Colour palette ────────────────────────────────────────────────────────────

const SKILL_COLORS: Record<string, string> = {
  addition:       "#6366f1",
  subtraction:    "#f59e0b",
  multiplication: "#10b981",
  division:       "#ef4444",
};

const FALLBACK_COLORS = ["#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];

function colorForSkill(skill: string, index: number): string {
  return (
    SKILL_COLORS[skill.toLowerCase()] ??
    FALLBACK_COLORS[index % FALLBACK_COLORS.length]
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/** Always express a duration in seconds (used for improvement deltas). */
function formatDeltaS(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

// ── Sparkline ─────────────────────────────────────────────────────────────────

const SW = 200;
const SH = 60;
const SP = { top: 6, right: 6, bottom: 6, left: 6 };
const INNER_SW = SW - SP.left - SP.right;
const INNER_SH = SH - SP.top - SP.bottom;

interface SparklineProps {
  values: number[]; // avg ms per practice session, chronological
  color: string;
}

function Sparkline({ values, color }: SparklineProps) {
  if (values.length < 2) {
    // Single point — just draw a dot in the centre
    return (
      <svg viewBox={`0 0 ${SW} ${SH}`} className="w-full" style={{ maxHeight: SH }}>
        <circle cx={SW / 2} cy={SH / 2} r={4} fill={color} />
      </svg>
    );
  }

  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  const xScale = (i: number) =>
    SP.left + (i / (values.length - 1)) * INNER_SW;
  const yScale = (v: number) =>
    SP.top + INNER_SH - ((v - minV) / range) * INNER_SH;

  const d = values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`)
    .join(" ");

  const lastX = xScale(values.length - 1);
  const lastY = yScale(values[values.length - 1]);

  return (
    <svg
      viewBox={`0 0 ${SW} ${SH}`}
      className="w-full"
      style={{ maxHeight: SH }}
      aria-label="Response time trend sparkline"
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* Highlight last point */}
      <circle cx={lastX} cy={lastY} r={3.5} fill={color} stroke="white" strokeWidth={1.5} />
    </svg>
  );
}

// ── SkillCard ─────────────────────────────────────────────────────────────────

export interface SkillStats {
  skill: string;
  skillIndex: number;
  /** Avg response time (ms) for each session this skill was practiced, oldest first */
  avgMsHistory: number[];
  /** Total questions attempted across all sessions */
  totalAttempted: number;
  /** Total correct across all sessions */
  totalCorrect: number;
  /** Total prompts (attempted + skipped) across all sessions */
  totalPrompts: number;
  /** Number of sessions this skill was practiced */
  sessionCount: number;
}

interface Props {
  stats: SkillStats;
}

export function SkillCard({ stats }: Props) {
  const {
    skill,
    skillIndex,
    avgMsHistory,
    totalAttempted,
    totalCorrect,
    totalPrompts,
    sessionCount,
  } = stats;

  const color = colorForSkill(skill, skillIndex);

  const overallAccuracy =
    totalAttempted > 0
      ? `${Math.round((totalCorrect / totalAttempted) * 100)}%`
      : "—";

  const latestAvgMs =
    avgMsHistory.length > 0
      ? avgMsHistory[avgMsHistory.length - 1]
      : undefined;

  // Compare latest session to the previous one (second-to-last)
  const prevAvgMs =
    avgMsHistory.length >= 2
      ? avgMsHistory[avgMsHistory.length - 2]
      : undefined;

  // Improvement: negative delta = faster (good), positive = slower
  const improvement =
    prevAvgMs !== undefined && latestAvgMs !== undefined
      ? latestAvgMs - prevAvgMs
      : null;

  const improvementLabel =
    improvement === null
      ? null
      : improvement < 0
        ? `▲ ${formatDeltaS(Math.abs(improvement))} faster since last session`
        : improvement > 0
          ? `▼ ${formatDeltaS(improvement)} slower since last session`
          : "No change since last session";

  const improvementColor =
    improvement === null
      ? ""
      : improvement < 0
        ? "text-green-600"
        : improvement > 0
          ? "text-red-500"
          : "text-slate-400";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-base font-semibold text-slate-800">
          {capitalize(skill)}
        </h3>
        <span className="ml-auto text-xs text-slate-400">
          {sessionCount} session{sessionCount === 1 ? "" : "s"}
        </span>
      </div>

      {/* Key stats */}
      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-xl font-bold text-slate-800">
            {overallAccuracy}
          </div>
          <div className="text-xs text-slate-400">Accuracy</div>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-800">
            {totalPrompts}
          </div>
          <div className="text-xs text-slate-400">Prompts</div>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-800">
            {latestAvgMs !== undefined ? formatMs(latestAvgMs) : "—"}
          </div>
          <div className="text-xs text-slate-400">Latest avg</div>
        </div>
      </div>

      {/* Improvement badge */}
      {improvementLabel && (
        <div className={`mb-3 text-xs font-medium ${improvementColor}`}>
          {improvementLabel}
        </div>
      )}

      {/* Sparkline */}
      {avgMsHistory.length > 0 && (
        <Sparkline values={avgMsHistory} color={color} />
      )}
    </div>
  );
}
