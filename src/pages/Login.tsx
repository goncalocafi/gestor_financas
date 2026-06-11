import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
    } catch {
      setError("Não foi possível iniciar sessão. Tenta novamente.");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-slate-900 px-6 text-center">
      <div>
        <p className="text-5xl">💶</p>
        <h1 className="mt-4 text-3xl font-bold text-white">O Meu Gestor</h1>
        <p className="mt-2 text-slate-400">As tuas finanças pessoais, simples e privadas.</p>
      </div>
      <button
        onClick={handleLogin}
        className="flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 shadow-lg hover:bg-slate-100 active:scale-95"
      >
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.2 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
          <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.2 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
          <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41.4 35.2 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"/>
        </svg>
        Entrar com Google
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
