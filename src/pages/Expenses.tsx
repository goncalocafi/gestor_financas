import { MonthPicker } from "../components/MonthPicker";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { useAuth } from "../hooks/useAuth";
import { useMonthData } from "../hooks/useMonthData";
import { exportExpensesCsv } from "../lib/exportCsv";
import {
  addExpense,
  addExpenseInstallments,
  deleteExpense,
  updateExpenseCategory,
  updateExpenseExceptional,
} from "../services/expenses";
import type { MonthKey } from "../types";

interface Props {
  month: MonthKey;
  onMonthChange: (m: MonthKey) => void;
}

export function Expenses({ month, onMonthChange }: Props) {
  const { user } = useAuth();
  const { expenses, fixedInMonth } = useMonthData(month);

  if (!user) return null;

  return (
    <div className="space-y-4">
      <MonthPicker value={month} onChange={onMonthChange} />
      <ExpenseForm
        onSubmit={(input, installments) =>
          installments > 1
            ? addExpenseInstallments(user.uid, input, installments)
            : addExpense(user.uid, input)
        }
      />
      <section>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Histórico do mês</h2>
          <button
            onClick={() => exportExpensesCsv(month, expenses, fixedInMonth)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            ⇩ Exportar CSV
          </button>
        </div>
        <ExpenseList
          expenses={expenses}
          onDelete={(id) => deleteExpense(user.uid, id)}
          onCategoryChange={(id, category) => updateExpenseCategory(user.uid, id, category)}
          onToggleExceptional={(id, value) => updateExpenseExceptional(user.uid, id, value)}
        />
      </section>
    </div>
  );
}
