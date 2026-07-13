import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Expenses } from "./pages/Expenses";
import { FixedExpenses } from "./pages/FixedExpenses";
import { Debts } from "./pages/Debts";
import { Trends } from "./pages/Trends";
import { Settings } from "./pages/Settings";
import { currentMonthKey } from "./types";

function AppRoutes() {
  const { user, loading } = useAuth();
  // Mês/ano selecionado, partilhado entre Resumo e Despesas
  const [month, setMonth] = useState(currentMonthKey());

  if (loading) {
    return <div className="flex min-h-dvh items-center justify-center text-slate-400">A carregar…</div>;
  }

  if (!user) return <Login />;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard month={month} onMonthChange={setMonth} />} />
        <Route path="/despesas" element={<Expenses month={month} onMonthChange={setMonth} />} />
        <Route path="/fixas" element={<FixedExpenses />} />
        <Route path="/devem-me" element={<Debts month={month} onMonthChange={setMonth} />} />
        <Route path="/tendencias" element={<Trends />} />
        <Route path="/definicoes" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
