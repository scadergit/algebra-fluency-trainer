import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useStudent } from "../../features/student/StudentContext";

interface MainLayoutProps {
  children: ReactNode;
}

const navItem =
  "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900";

const activeNavItem =
  "bg-blue-600 text-white hover:bg-blue-700 hover:text-white";

// ── Icons ─────────────────────────────────────────────────────────────────────

function PracticeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
      <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2Zm.75 4.75a.75.75 0 0 0-1.5 0v3.5l-1.72 1.72a.75.75 0 1 0 1.06 1.06l2-2a.75.75 0 0 0 .22-.53v-3.75Z" />
    </svg>
  );
}

function StatisticsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
      <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10 7A1.5 1.5 0 0 0 8.5 8.5v8a1.5 1.5 0 0 0 3 0v-8A1.5 1.5 0 0 0 10 7ZM4.5 12A1.5 1.5 0 0 0 3 13.5v3a1.5 1.5 0 0 0 3 0v-3A1.5 1.5 0 0 0 4.5 12Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
      <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .206 1.25l-1.18 2.045a1 1 0 0 1-1.187.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.114a7.05 7.05 0 0 1 0-2.227L1.821 7.773a1 1 0 0 1-.206-1.25l1.18-2.045a1 1 0 0 1 1.187-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 text-slate-400">
      <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
    </svg>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function MainLayout({ children }: MainLayoutProps) {
  const { activeStudent, clearActiveStudent } = useStudent();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <h1 className="text-xl font-bold text-slate-900">
            Algebra Fluency Trainer
          </h1>

          <nav className="flex items-center gap-2">
            <NavLink
              to="/practice"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNavItem : ""}`
              }
            >
              <PracticeIcon />
              Practice
            </NavLink>

            <NavLink
              to="/statistics"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNavItem : ""}`
              }
            >
              <StatisticsIcon />
              Statistics
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNavItem : ""}`
              }
            >
              <SettingsIcon />
              Settings
            </NavLink>

            {activeStudent && (
              <div className="ml-4 flex items-center gap-2 border-l border-slate-200 pl-4">
                <UserIcon />
                <span className="text-sm font-medium text-slate-700">
                  {activeStudent}
                </span>
                <button
                  onClick={clearActiveStudent}
                  className="text-xs text-slate-400 underline hover:text-slate-600"
                >
                  Switch
                </button>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
