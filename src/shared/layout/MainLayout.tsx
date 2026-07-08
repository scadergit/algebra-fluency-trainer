import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

const navItem =
  "rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 hover:text-slate-900";

const activeNavItem =
  "bg-blue-600 text-white hover:bg-blue-700 hover:text-white";

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <h1 className="text-xl font-bold text-slate-900">
            Algebra Fluency Trainer
          </h1>

          <nav className="flex gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNavItem : ""}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/practice"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNavItem : ""}`
              }
            >
              Practice
            </NavLink>

            <NavLink
              to="/statistics"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNavItem : ""}`
              }
            >
              Statistics
            </NavLink>

            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${navItem} ${isActive ? activeNavItem : ""}`
              }
            >
              Settings
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}