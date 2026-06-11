import { formatCurrency, type Expense } from "../types";

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export function ExpenseList({ expenses, onDelete }: Props) {
  if (expenses.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">Sem despesas registadas neste mês.</p>;
  }
  return (
    <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
      {expenses.map((e) => (
        <li key={e.id} className="flex items-center gap-3 p-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{e.description}</p>
            <p className="text-xs text-slate-500">
              {new Date(e.date + "T00:00").toLocaleDateString("pt-PT")} · {e.category}
            </p>
          </div>
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
