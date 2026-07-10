import { useState } from "react";
import { Card } from "../../shared/components/Card";
import { Page } from "../../shared/components/Page";
import { useSettings } from "./SettingsContext";
import { useSessionHistory } from "../../shared/hooks/useSessionHistory";
import { useStudent } from "../student/StudentContext";

const TEACHER_SECRET = "teachersecret";

// ── TeacherGate ───────────────────────────────────────────────────────────────

function TeacherGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === TEACHER_SECRET) {
      onUnlock();
    } else {
      setError(true);
      setInput("");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-center text-lg font-semibold text-slate-800">
          Teacher Access
        </h2>
        <p className="mb-6 text-center text-sm text-slate-500">
          Enter the teacher password to access settings.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            placeholder="Password"
            value={input}
            autoFocus
            onChange={(e) => { setInput(e.target.value); setError(false); }}
          />
          {error && (
            <p className="text-sm text-red-500">Incorrect password.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Unlock
          </button>
        </form>
      </div>
    </div>
  );
}

// ── StudentPanel ──────────────────────────────────────────────────────────────

function StudentPanel() {
  const { knownStudents, activeStudent, loginStudentAsTeacher, setStudentSecret, clearActiveStudent } = useStudent();
  const [editingSecret, setEditingSecret] = useState<string | null>(null);
  const [newSecret, setNewSecret] = useState("");
  const [saved, setSaved] = useState<string | null>(null);

  function handleSetSecret(name: string) {
    if (!newSecret.trim()) return;
    setStudentSecret(name, newSecret.trim());
    setNewSecret("");
    setEditingSecret(null);
    setSaved(name);
    setTimeout(() => setSaved(null), 2000);
  }

  return (
    <div className="w-64 shrink-0">
      <Card>
        <h2 className="mb-1 text-base font-semibold text-slate-800">Students</h2>
        <p className="mb-4 text-xs text-slate-500">
          Click a student to switch to their settings. Set a new secret word if needed.
        </p>

        {knownStudents.length === 0 ? (
          <p className="text-sm text-slate-400">No students registered yet.</p>
        ) : (
          <ul className="space-y-1">
            {knownStudents.map((name) => {
              const isActive = name === activeStudent;
              return (
                <li key={name}>
                  <div
                    className={[
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                      isActive
                        ? "bg-indigo-50 font-semibold text-indigo-700"
                        : "text-slate-700 hover:bg-slate-50 cursor-pointer",
                    ].join(" ")}
                    onClick={() => {
                      if (!isActive) {
                        loginStudentAsTeacher(name);
                        setEditingSecret(null);
                      }
                    }}
                  >
                    <span>{name}</span>
                    <button
                      className="ml-2 text-xs text-slate-400 hover:text-indigo-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSecret(editingSecret === name ? null : name);
                        setNewSecret("");
                      }}
                      title="Change secret word"
                    >
                      🔑
                    </button>
                  </div>

                  {editingSecret === name && (
                    <form
                      className="mt-1 flex items-center gap-1 px-3 pb-2"
                      onSubmit={(e) => { e.preventDefault(); handleSetSecret(name); }}
                    >
                      <input
                        type="text"
                        className="w-28 rounded border border-slate-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                        placeholder="New secret"
                        value={newSecret}
                        autoFocus
                        onChange={(e) => setNewSecret(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={!newSecret.trim()}
                        className="rounded bg-indigo-600 px-2 py-1 text-xs text-white hover:bg-indigo-700 disabled:opacity-40"
                      >
                        Set
                      </button>
                    </form>
                  )}

                  {saved === name && (
                    <p className="px-3 pb-1 text-xs text-green-600">Saved!</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* "No student" / default option */}
        <div className="mt-3 border-t border-slate-100 pt-3">
          <div
            className={[
              "flex items-center rounded-lg px-3 py-2 text-sm",
              activeStudent === null
                ? "bg-indigo-50 font-semibold text-indigo-700"
                : "cursor-pointer text-slate-500 hover:bg-slate-50",
            ].join(" ")}
            onClick={() => { if (activeStudent !== null) clearActiveStudent(); }}
          >
            Default (no student)
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── SettingsPanel ─────────────────────────────────────────────────────────────

function SettingsPanel() {
  const { settings, setSettings } = useSettings();
  const { history, clearHistory } = useSessionHistory();
  const { activeStudent } = useStudent();

  const heading = activeStudent
    ? `Settings for ${activeStudent}`
    : "Settings for Default";

  return (
    <div className="flex-1 space-y-6">

      <p className="text-sm font-medium text-indigo-600">{heading}</p>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">Skills</h2>
        <div className="space-y-3">
          {[
            ["addition", "Addition"],
            ["subtraction", "Subtraction"],
            ["multiplication", "Multiplication"],
            ["division", "Division"],
          ].map(([id, label]) => (
            <label key={id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enabledSkills.includes(id)}
                onChange={(event) => {
                  const enabled = new Set(settings.enabledSkills);
                  if (event.target.checked) {
                    enabled.add(id);
                  } else {
                    enabled.delete(id);
                  }
                  setSettings({ ...settings, enabledSkills: [...enabled] });
                }}
              />
              {label}
            </label>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">Numbers</h2>

        <label className="block font-medium">Maximum Number</label>
        <input
          className="mt-2 w-full"
          type="range"
          min={5}
          max={20}
          value={settings.maxNumber}
          onChange={(event) =>
            setSettings({ ...settings, maxNumber: Number(event.target.value) })
          }
        />
        <div className="mt-1">{settings.maxNumber}</div>

        <label className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.allowNegativeNumbers}
            onChange={(event) =>
              setSettings({ ...settings, allowNegativeNumbers: event.target.checked })
            }
          />
          Allow Negative Numbers
        </label>

        <label className="mt-3 flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.allowFractions}
            onChange={(event) =>
              setSettings({ ...settings, allowFractions: event.target.checked })
            }
          />
          Allow Fractions
        </label>

        <label className="mt-3 flex items-center gap-3">
          <input
            type="checkbox"
            checked={settings.allowDecimals}
            onChange={(event) =>
              setSettings({ ...settings, allowDecimals: event.target.checked })
            }
          />
          Allow Decimals
        </label>
      </Card>

      <Card>
        <h2 className="mb-4 text-xl font-semibold">History</h2>
        <p className="mb-4 text-sm text-slate-500">
          {history.length === 0
            ? "No sessions recorded yet."
            : `${history.length} session${history.length === 1 ? "" : "s"} recorded.`}
        </p>
        <button
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-40"
          disabled={history.length === 0}
          onClick={clearHistory}
        >
          Clear History
        </button>
      </Card>

    </div>
  );
}

// ── SettingsPage ──────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <Page title="Settings">
      {!unlocked ? (
        <TeacherGate onUnlock={() => setUnlocked(true)} />
      ) : (
        <div className="flex items-start gap-6">
          <SettingsPanel />
          <StudentPanel />
        </div>
      )}
    </Page>
  );
}
