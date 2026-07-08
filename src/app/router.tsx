import { Navigate, Route, Routes } from "react-router-dom";

import DashboardPage from "../features/dashboard/DashboardPage";
import PracticePage from "../features/practice/PracticePage";
import SettingsPage from "../features/settings/SettingsPage";
import StatisticsPage from "../features/statistics/StatisticsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/practice" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}