import { useMemo, useState } from "react";
import { TrendChart } from "../components/TrendChart";
import { useMonthsComparison } from "../hooks/useMonthsComparison";
import { CATEGORIES, monthKey, type Category } from "../types";

const RANGE_OPTIONS = [3, 6, 12] as const;

function lastMonths(count: number): string[] {
  const now = new Date();
  const months: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthKey(d.getFullYear(), d.getMonth() + 1));
  }
  return months;
}

export function Trends() {
  const [rangeCount, setRangeCount] = useState<(typeof RANGE_OPTIONS)[number]>(3);
  const [selected, setSelected] = useState<Category[]>(["Alimentação"]);

  const months = useMemo(() => lastMonths(rangeCount), [rangeCount]);
  const { loading, rows } = useMonthsComparison(months);

  const toggleCategory = (c: Category) => {
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Tendências</h1>

      <div className="flex gap-2 rounded-2xl bg-white p-2 shadow-sm">
        {RANGE_OPTIONS.map((n) => (
          <button
            key={n}
            onClick={() => setRangeCount(n)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium ${
              rangeCount === n ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {n} meses
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl bg-white p-3 shadow-sm">
        {CATEGORIES.map((c) => (
          <label
            key={c}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${
              selected.includes(c)
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-slate-200 text-slate-500"
            }`}
          >
            <input type="checkbox" className="hidden" checked={selected.includes(c)} onChange={() => toggleCategory(c)} />
            {c}
          </label>
        ))}
      </div>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        {loading ? (
          <p className="py-10 text-center text-sm text-slate-400">A carregar…</p>
        ) : (
          <TrendChart rows={rows} categories={selected} />
        )}
      </section>
    </div>
  );
}
