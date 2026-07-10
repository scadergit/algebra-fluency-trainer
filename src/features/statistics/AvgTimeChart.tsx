/**
 * AvgTimeChart
 *
 * Renders a pure-SVG line chart showing average response time per skill.
 *
 * X-axis: "practice number" — the 1st, 2nd, 3rd … time that skill was
 *         included in a session.  Each skill has its own independent counter,
 *         so Addition might have 5 data points while Division has 2.
 *
 * Y-axis: average response time in milliseconds for that session.
 *
 * Only sessions that have `avgResponseMsBySkill` data are used.
 */

import type { SessionRecord } from "../../types/SessionRecord";

// ── Colour palette ────────────────────────────────────────────────────────────

const SKILL_COLORS: Record<string, string> = {
  addition:       "#6366f1", // indigo
  subtraction:    "#f59e0b", // amber
  multiplication: "#10b981", // emerald
  division:       "#ef4444", // red
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

// ── Types ─────────────────────────────────────────────────────────────────────

/** One dot on the chart: the Nth time this skill was practiced */
interface Point {
  practiceNumber: number; // 1-based
  ms: number;
}

interface SkillSeries {
  skill: string;
  color: string;
  points: Point[]; // sorted by practiceNumber ascending
}

// ── Chart dimensions ──────────────────────────────────────────────────────────

const W = 600;
const H = 260;
const PAD = { top: 20, right: 20, bottom: 40, left: 56 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

// ── AvgTimeChart ──────────────────────────────────────────────────────────────

interface Props {
  history: SessionRecord[];
}

export function AvgTimeChart({ history }: Props) {
  // Sessions with per-skill data, oldest first
  const sessions = [...history]
    .filter(
      (r) =>
        r.avgResponseMsBySkill &&
        Object.keys(r.avgResponseMsBySkill).length > 0,
    )
    .reverse(); // history is stored newest-first; we want chronological order

  if (sessions.length === 0) return null;

  // Build per-skill series: for each skill, collect the ms values in the order
  // the sessions occurred, giving each its own 1-based practice number.
  const skillMap = new Map<string, number[]>();

  for (const session of sessions) {
    for (const [skill, ms] of Object.entries(
      session.avgResponseMsBySkill!,
    )) {
      if (!skillMap.has(skill)) skillMap.set(skill, []);
      skillMap.get(skill)!.push(ms);
    }
  }

  const skills = Array.from(skillMap.keys()).sort();

  const series: SkillSeries[] = skills.map((skill, i) => ({
    skill,
    color: colorForSkill(skill, i),
    points: (skillMap.get(skill) ?? []).map((ms, idx) => ({
      practiceNumber: idx + 1,
      ms,
    })),
  }));

  // Y-axis domain across all series
  const allMs = series.flatMap((s) => s.points.map((p) => p.ms));
  const minMs = Math.max(0, Math.min(...allMs) * 0.85);
  const maxMs = Math.max(...allMs) * 1.15;

  // X-axis domain: 1 … maxPracticeNumber
  const maxPracticeNumber = Math.max(
    ...series.map((s) => s.points.length),
  );

  // Scale helpers
  const xScale = (n: number) =>
    maxPracticeNumber === 1
      ? PAD.left + INNER_W / 2
      : PAD.left + ((n - 1) / (maxPracticeNumber - 1)) * INNER_W;

  const yScale = (ms: number) =>
    PAD.top +
    INNER_H -
    ((ms - minMs) / (maxMs - minMs || 1)) * INNER_H;

  // Y-axis ticks (5 evenly spaced)
  const yTicks = Array.from(
    { length: 5 },
    (_, i) => minMs + (i / 4) * (maxMs - minMs),
  );

  // X-axis ticks: integers 1 … maxPracticeNumber (cap at 10 labels)
  const xTickStep = Math.max(1, Math.ceil(maxPracticeNumber / 10));
  const xTicks = Array.from(
    { length: maxPracticeNumber },
    (_, i) => i + 1,
  ).filter((n) => (n - 1) % xTickStep === 0 || n === maxPracticeNumber);

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Avg Response Time by Skill
      </h3>

      {/* Legend */}
      <div className="mb-3 flex flex-wrap gap-4">
        {series.map(({ skill, color }) => (
          <div key={skill} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-6 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-slate-600">
              {capitalize(skill)}
            </span>
          </div>
        ))}
      </div>

      {/* SVG chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxHeight: 280 }}
        aria-label="Average response time per skill line chart"
      >
        {/* Horizontal grid lines + Y labels */}
        {yTicks.map((ms) => {
          const y = yScale(ms);
          return (
            <g key={ms}>
              <line
                x1={PAD.left}
                x2={PAD.left + INNER_W}
                y1={y}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 6}
                y={y + 4}
                textAnchor="end"
                fontSize={10}
                fill="#94a3b8"
              >
                {formatMs(ms)}
              </text>
            </g>
          );
        })}

        {/* X-axis tick labels */}
        {xTicks.map((n) => (
          <text
            key={n}
            x={xScale(n)}
            y={H - PAD.bottom + 16}
            textAnchor="middle"
            fontSize={10}
            fill="#94a3b8"
          >
            {n}
          </text>
        ))}

        {/* X-axis title */}
        <text
          x={PAD.left + INNER_W / 2}
          y={H - 4}
          textAnchor="middle"
          fontSize={10}
          fill="#94a3b8"
        >
          Practice #
        </text>

        {/* Lines + dots per skill */}
        {series.map(({ skill, color, points }) => {
          if (points.length === 0) return null;

          const d = points
            .map((p, i) => {
              const x = xScale(p.practiceNumber);
              const y = yScale(p.ms);
              return `${i === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");

          return (
            <g key={skill}>
              <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={2.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {points.map((p) => (
                <circle
                  key={p.practiceNumber}
                  cx={xScale(p.practiceNumber)}
                  cy={yScale(p.ms)}
                  r={4}
                  fill={color}
                  stroke="white"
                  strokeWidth={1.5}
                >
                  <title>
                    {capitalize(skill)}: {formatMs(p.ms)} (practice{" "}
                    {p.practiceNumber})
                  </title>
                </circle>
              ))}
            </g>
          );
        })}

        {/* Axes */}
        <line
          x1={PAD.left}
          x2={PAD.left}
          y1={PAD.top}
          y2={PAD.top + INNER_H}
          stroke="#cbd5e1"
          strokeWidth={1}
        />
        <line
          x1={PAD.left}
          x2={PAD.left + INNER_W}
          y1={PAD.top + INNER_H}
          y2={PAD.top + INNER_H}
          stroke="#cbd5e1"
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
