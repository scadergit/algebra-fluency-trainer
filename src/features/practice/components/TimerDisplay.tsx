interface TimerDisplayProps {
  secondsRemaining: number;
  totalSeconds: number;
  paused?: boolean;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function TimerDisplay({
  secondsRemaining,
  totalSeconds,
  paused = false,
}: TimerDisplayProps) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const fraction = secondsRemaining / totalSeconds;
  const isLow = fraction <= 0.2;

  const color = paused
    ? "text-blue-300"
    : isLow
      ? "text-red-600"
      : "text-slate-800";

  return (
    <div
      className={[
        "text-center text-4xl font-bold tabular-nums transition-colors duration-300",
        color,
      ].join(" ")}
    >
      {pad(minutes)}:{pad(seconds)}
    </div>
  );
}
