import { formatCurrency, type FixedExpense } from "../types";

interface Props {
  items: FixedExpense[];
  onEnd: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FixedExpenseList({ items, onEnd, onDelete }: Props) {
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
              {f.category} · desde {f.startMonth}
              {f.endMonth ? ` · terminou em ${f.endMonth}` : " · ativa"}
            </p>
          </div>
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
