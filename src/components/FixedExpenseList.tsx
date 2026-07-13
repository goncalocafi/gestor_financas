import { CATEGORIES, SAVINGS_CATEGORIES, formatCurrency, type AnyCategory, type FixedExpense } from "../types";

interface Props {
  items: FixedExpense[];
  onEnd: (id: string) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: AnyCategory) => void;
}

export function FixedExpenseList({ items, onEnd, onDelete, onCategoryChange }: Props) {
  if (items.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">Sem despesas fixas registadas.</p>;
  }
  return (
    <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
      {items.map((f) => (
        <li key={f.id} className="flex items-center gap-3 p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{f.description}</p>
            <p className="text-xs text-slate-500">
              desde {f.startMonth}
              {f.endMonth ? ` · terminou em ${f.endMonth}` : " · ativa"}
            </p>
          </div>
          <select
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
            value={f.category}
            onChange={(e) => onCategoryChange(f.id, e.target.value as AnyCategory)}
            aria-label={`Categoria de ${f.description}`}
          >
            <optgroup label="Despesas">
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </optgroup>
            <optgroup label="Poupança">
              {SAVINGS_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </optgroup>
          </select>
          <span className="font-semibold">{formatCurrency(f.amount)}/mês</span>
          {f.endMonth === null && (
            <button
              onClick={() => onEnd(f.id)}
              className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-amber-50 hover:text-amber-700"
              title="Terminar a recorrência neste mês"
            >
              Terminar
            </button>
          )}
          <button
            onClick={() => onDelete(f.id)}
            aria-label={`Apagar ${f.description}`}
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
