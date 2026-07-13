import { CATEGORIES, SAVINGS_CATEGORIES, formatCurrency, isSavingsCategory, type AnyCategory, type Expense } from "../types";

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: AnyCategory) => void;
  onToggleExceptional: (id: string, value: boolean) => void;
}

export function ExpenseList({ expenses, onDelete, onCategoryChange, onToggleExceptional }: Props) {
  if (expenses.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">Sem despesas registadas neste mês.</p>;
  }
  return (
    <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
      {expenses.map((e) => (
        <li key={e.id} className="flex items-center gap-3 p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">
              {e.description}
              {isSavingsCategory(e.category) && (
                <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                  Poupança
                </span>
              )}
              {e.isExceptional && (
                <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  Excecional
                </span>
              )}
            </p>
            <p className="text-xs text-slate-500">{new Date(e.date + "T00:00").toLocaleDateString("pt-PT")}</p>
          </div>
          <button
            onClick={() => onToggleExceptional(e.id, !e.isExceptional)}
            aria-label={`Marcar ${e.description} como excecional`}
            title="Despesa excecional (não conta para tendências)"
            className={`rounded-lg px-1.5 py-1 text-xs ${e.isExceptional ? "text-amber-600" : "text-slate-300 hover:text-slate-400"}`}
          >
            ★
          </button>
          <select
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
            value={e.category}
            onChange={(ev) => onCategoryChange(e.id, ev.target.value as AnyCategory)}
            aria-label={`Categoria de ${e.description}`}
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
          <span className="font-semibold">{formatCurrency(e.amount)}</span>
          <button
            onClick={() => onDelete(e.id)}
            aria-label={`Apagar ${e.description}`}
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
