import { FixedExpenseForm } from "../components/FixedExpenseForm";
import { FixedExpenseList } from "../components/FixedExpenseList";
import { useAuth } from "../hooks/useAuth";
import { useMonthData } from "../hooks/useMonthData";
import { addFixedExpense, deleteFixedExpense, endFixedExpense } from "../services/fixedExpenses";
import { currentMonthKey } from "../types";

export function FixedExpenses() {
  const { user } = useAuth();
  const { allFixed } = useMonthData(currentMonthKey());

  if (!user) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        As despesas fixas são contabilizadas automaticamente em todos os meses em que estão ativas
        — não precisas de as registar todos os meses.
      </p>
      <FixedExpenseForm onSubmit={(input) => addFixedExpense(user.uid, input)} />
      <FixedExpenseList
        items={allFixed}
        onEnd={(id) => endFixedExpense(user.uid, id, currentMonthKey())}
        onDelete={(id) => deleteFixedExpense(user.uid, id)}
      />
    </div>
  );
}
