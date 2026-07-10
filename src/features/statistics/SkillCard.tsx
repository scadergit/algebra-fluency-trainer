/**
 * SkillCard
 *
 * Displays aggregate statistics for a single skill across all sessions,
 * plus a mini line chart showing QPM trend over sessions with a fixed
 * Y-axis from 0 to 50 (steps of 10).
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

/** Convert average milliseconds per question to questions per minute. */
function msToQpm(ms: number): number {
  if (ms <= 0) return 0;
  return 60_000 / ms;
}

// ── QPM Chart ─────────────────────────────────────────────────────────────────

// Chart dimensions
const CW = 220;
const CH = 80;
const CP = { top: 4, right: 6, bottom: 4, left: 30 };
const INNER_CW = CW - CP.left - CP.right;
const INNER_CH = CH - CP.top - CP.bottom;

// Fixed Y-axis domain: 0–50 QPM
// Three labelled threshold gridlines are shown
const Y_MIN = 0;
const Y_MAX = 50;
const Y_THRESHOLDS: { value: number; label: string }[] = [
  { value: 10, label: "Base" },
  { value: 30, label: "Avg" },
  { value: 50, label: "Goal" },
];

interface QpmChartProps {
  /** QPM values per practice session, chronological */
  values: number[];
  color: string;
}

function QpmChart({ values, color }: QpmChartProps) {
  const xScale = (i: number) =>
    values.length === 1
      ? CP.left + INNER_CW / 2
      : CP.left + (i / (values.length - 1)) * INNER_CW;

  const yScale = (v: number) =>
    CP.top + INNER_CH - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * INNER_CH;

  const lastX = xScale(values.length - 1);
  const lastY = yScale(values[values.length - 1]);

  const d =
    values.length >= 2
      ? values
          .map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`)
          .join(" ")
      : null;

  return (
    <svg
      viewBox={`0 0 ${CW} ${CH}`}
      className="w-full"
      style={{ maxHeight: CH }}
      aria-label="Questions per minute trend chart"
    >
      {/* Y-axis threshold gridlines + labels */}
      {Y_THRESHOLDS.map(({ value, label }) => {
        const y = yScale(value);
        return (
          <g key={value}>
            <line
              x1={CP.left}
              x2={CP.left + INNER_CW}
              y1={y}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth={1}
            />
            {label && (
              <text
                x={CP.left - 3}
                y={y + 3.5}
                textAnchor="end"
                fontSize={9}
                fill="#94a3b8"
              >
                {label}
              </text>
            )}
          </g>
        );
      })}

      {/* Y-axis line */}
      <line
        x1={CP.left}
        x2={CP.left}
        y1={CP.top}
        y2={CP.top + INNER_CH}
        stroke="#cbd5e1"
        strokeWidth={1}
      />

      {/* Line connecting data points */}
      {d && (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity={0.8}
        />
      )}

      {/* All data points */}
      {values.map((v, i) => (
        <circle
          key={i}
          cx={xScale(i)}
          cy={yScale(v)}
          r={2.5}
          fill={color}
          opacity={0.5}
        >
          <title>Practice {i + 1}: {v.toFixed(1)} q/min</title>
        </circle>
      ))}

      {/* Highlight last point */}
      <circle
        cx={lastX}
        cy={lastY}
        r={3.5}
        fill={color}
        stroke="white"
        strokeWidth={1.5}
      >
        <title>Latest: {values[values.length - 1].toFixed(1)} q/min</title>
      </circle>
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
    sessionCount,
  } = stats;

  const color = colorForSkill(skill, skillIndex);

  const overallAccuracy =
    totalAttempted > 0
      ? `${Math.round((totalCorrect / totalAttempted) * 100)}%`
      : "—";

  // Convert ms history to QPM history
  const qpmHistory = avgMsHistory.map(msToQpm);

  const latestQpm =
    qpmHistory.length > 0 ? qpmHistory[qpmHistory.length - 1] : undefined;

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
      <div className="mb-4 grid grid-cols-2 gap-3 text-center">
        <div>
          <div className="text-xl font-bold text-slate-800">
            {overallAccuracy}
          </div>
          <div className="text-xs text-slate-400">Accuracy</div>
        </div>
        <div>
          <div className="text-xl font-bold text-slate-800">
            {latestQpm !== undefined ? latestQpm.toFixed(1) : "—"}
          </div>
          <div className="text-xs text-slate-400">avg q/min</div>
        </div>
      </div>

      {/* QPM chart with Y-axis thresholds 0–50 */}
      {qpmHistory.length > 0 && (
        <QpmChart values={qpmHistory} color={color} />
      )}
    </div>
  );
}
