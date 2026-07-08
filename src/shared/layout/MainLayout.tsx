import { NavLink } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? "#2563eb" : "#444",
    textDecoration: "none",
    fontWeight: 600,
  });

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: 32,
        fontFamily: "system-ui",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 40,
        }}
      >
        <h2>Algebra Fluency Trainer</h2>

        <nav
          style={{
            display: "flex",
            gap: 24,
          }}
        >
          <NavLink to="/dashboard" style={linkStyle}>
            Dashboard
          </NavLink>

          <NavLink to="/practice" style={linkStyle}>
            Practice
          </NavLink>

          <NavLink to="/statistics" style={linkStyle}>
            Statistics
          </NavLink>

          <NavLink to="/settings" style={linkStyle}>
            Settings
          </NavLink>
        </nav>
      </header>

      {children}
    </div>
  );
}