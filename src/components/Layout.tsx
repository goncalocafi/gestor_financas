import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const tabs = [
  { to: "/", label: "Resumo", icon: "📊" },
  { to: "/despesas", label: "Despesas", icon: "🧾" },
  { to: "/fixas", label: "Fixas", icon: "🔁" },
  { to: "/devem-me", label: "Devem-me", icon: "🤝" },
  { to: "/tendencias", label: "Tendências", icon: "📈" },
  { to: "/definicoes", label: "Definições", icon: "⚙️" },
];

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col">
      <header className="flex items-center justify-between px-4 py-4">
        <h1 className="text-lg font-bold">O Meu Gestor</h1>
        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
          )}
          <button onClick={logout} className="text-sm text-slate-500 hover:text-slate-900">
            Sair
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pb-24">
        <Outlet />
      </main>

      {/* Navegação inferior, mobile-first */}
      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === "/"}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs ${
                  isActive ? "font-semibold text-indigo-600" : "text-slate-500"
                }`
              }
            >
              <span className="text-base">{t.icon}</span>
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
