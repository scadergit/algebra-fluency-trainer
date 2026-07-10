import { useEffect, useState } from "react";

interface CountdownOverlayProps {
  onComplete(): void;
}

const STEPS = ["Ready…", "Set…", "Go!"];
const STEP_MS = 800;

export function CountdownOverlay({
  onComplete,
}: CountdownOverlayProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length) {
      onComplete();
      return;
    }

    const id = window.setTimeout(
      () => setStep((s) => s + 1),
      STEP_MS,
    );

    return () => window.clearTimeout(id);
  }, [step, onComplete]);

  const label = STEPS[step] ?? "";
  const isGo = label === "Go!";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div
        key={step}
        className={[
          "animate-bounce-in text-center text-7xl font-extrabold drop-shadow-lg",
          isGo ? "text-green-400" : "text-white",
        ].join(" ")}
        style={{
          animation: "countdownPop 0.35s ease-out both",
        }}
      >
        {label}
      </div>
    </div>
  );
}
