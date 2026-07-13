import { formatCurrency, type FixedExpense } from "../types";

interface Props {
  fixedInMonth: FixedExpense[];
  confirmedIds: Set<string>;
  onToggle: (fixedExpenseId: string, confirmed: boolean) => void;
}

export function FixedExpensesConfirmation({ fixedInMonth, confirmedIds, onToggle }: Props) {
  if (fixedInMonth.length === 0) return null;

  return (
    <section className="space-y-2 rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="font-semibold">Confirmar despesas fixas deste mês</h2>
      <p className="text-xs text-slate-500">
        Só um lembrete visual — as fixas já contam automaticamente no total, mesmo sem confirmares.
      </p>
      <ul className="divide-y divide-slate-100">
        {fixedInMonth.map((f) => {
          const confirmed = confirmedIds.has(f.id);
          return (
            <li key={f.id} className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => onToggle(f.id, e.target.checked)}
                aria-label={`Confirmar ${f.description}`}
              />
              <span className={`flex-1 text-sm ${confirmed ? "text-slate-400 line-through" : ""}`}>
                {f.description}
              </span>
              <span className="text-sm font-medium">{formatCurrency(f.amount)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
