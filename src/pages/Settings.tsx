import { useEffect, useState, type FormEvent } from "react";
import { useSettings } from "../hooks/useSettings";
import { useBudgets } from "../hooks/useBudgets";
import { CATEGORIES, type Category } from "../types";

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

export function Settings() {
  const { loading: loadingSettings, settings, save } = useSettings();
  const { limits, updateBudget, removeBudget } = useBudgets();

  const [income, setIncome] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");

  useEffect(() => {
    if (!loadingSettings) {
      setIncome(settings.monthlyIncome ? String(settings.monthlyIncome) : "");
      setSavingsGoal(settings.monthlySavingsGoal ? String(settings.monthlySavingsGoal) : "");
    }
  }, [loadingSettings, settings]);

  const handleSaveIncome = async (e: FormEvent) => {
    e.preventDefault();
    const value = Number(income.replace(",", "."));
    await save({ monthlyIncome: Number.isFinite(value) ? value : 0 });
  };

  const handleSaveGoal = async (e: FormEvent) => {
    e.preventDefault();
    const value = Number(savingsGoal.replace(",", "."));
    await save({ monthlySavingsGoal: Number.isFinite(value) ? value : 0 });
  };

  const handleBudgetChange = (category: Category, raw: string) => {
    const value = Number(raw.replace(",", "."));
    if (!raw) {
      removeBudget(category);
      return;
    }
    if (Number.isFinite(value) && value > 0) updateBudget(category, value);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Definições</h1>

      <form onSubmit={handleSaveIncome} className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
        <label className="text-sm font-medium">Rendimento mensal</label>
        <div className="flex gap-2">
          <input
            className={inputCls}
            type="text"
            inputMode="decimal"
            placeholder="€"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
          <button type="submit" className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Guardar
          </button>
        </div>
      </form>

      <form onSubmit={handleSaveGoal} className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
        <label className="text-sm font-medium">Meta de poupança mensal</label>
        <div className="flex gap-2">
          <input
            className={inputCls}
            type="text"
            inputMode="decimal"
            placeholder="€"
            value={savingsGoal}
            onChange={(e) => setSavingsGoal(e.target.value)}
          />
          <button type="submit" className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            Guardar
          </button>
        </div>
      </form>

      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
        <h2 className="text-sm font-medium">Metas por categoria</h2>
        <p className="text-xs text-slate-500">Deixa em branco para remover o limite de uma categoria.</p>
        <div className="space-y-2">
          {CATEGORIES.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <span className="w-32 shrink-0 truncate text-sm">{c}</span>
              <input
                className={inputCls}
                type="text"
                inputMode="decimal"
                placeholder="€"
                defaultValue={limits[c] ?? ""}
                onBlur={(e) => handleBudgetChange(c, e.target.value)}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
