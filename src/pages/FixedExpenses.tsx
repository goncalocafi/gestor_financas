import { FixedExpenseForm } from "../components/FixedExpenseForm";
import { FixedExpenseList } from "../components/FixedExpenseList";
import { FixedExpensesConfirmation } from "../components/FixedExpensesConfirmation";
import { useAuth } from "../hooks/useAuth";
import { useMonthData } from "../hooks/useMonthData";
import { useFixedConfirmations } from "../hooks/useFixedConfirmations";
import { addFixedExpense, deleteFixedExpense, endFixedExpense } from "../services/fixedExpenses";
import { currentMonthKey } from "../types";

export function FixedExpenses() {
  const { user } = useAuth();
  const month = currentMonthKey();
  const { allFixed, fixedInMonth } = useMonthData(month);
  const { confirmedIds, toggle } = useFixedConfirmations(month);

  if (!user) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        As despesas fixas são contabilizadas automaticamente em todos os meses em que estão ativas
        — não precisas de as registar todos os meses.
      </p>
      <FixedExpensesConfirmation fixedInMonth={fixedInMonth} confirmedIds={confirmedIds} onToggle={toggle} />
      <FixedExpenseForm onSubmit={(input) => addFixedExpense(user.uid, input)} />
      <FixedExpenseList
        items={allFixed}
        onEnd={(id) => endFixedExpense(user.uid, id, currentMonthKey())}
        onDelete={(id) => deleteFixedExpense(user.uid, id)}
      />
    </div>
  );
}
