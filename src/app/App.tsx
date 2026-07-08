import MainLayout from "../shared/layout/MainLayout";
import AppRouter from "./router";

export default function App() {
  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  );
}