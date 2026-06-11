import { MonthPicker } from "../components/MonthPicker";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { useAuth } from "../hooks/useAuth";
import { useMonthData } from "../hooks/useMonthData";
import { addExpense, addExpenseInstallments, deleteExpense } from "../services/expenses";
import type { MonthKey } from "../types";

interface Props {
  month: MonthKey;
  onMonthChange: (m: MonthKey) => void;
}

export function Expenses({ month, onMonthChange }: Props) {
  const { user } = useAuth();
  const { expenses } = useMonthData(month);

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
        <h2 className="mb-2 font-semibold">Histórico do mês</h2>
        <ExpenseList expenses={expenses} onDelete={(id) => deleteExpense(user.uid, id)} />
      </section>
    </div>
  );
}
