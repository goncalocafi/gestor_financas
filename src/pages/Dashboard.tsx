import { MonthPicker } from "../components/MonthPicker";
import { SummaryCards } from "../components/SummaryCards";
import { CategoryChart } from "../components/CategoryChart";
import { UnallocatedBalance } from "../components/UnallocatedBalance";
import { SavingsGoalProgress } from "../components/SavingsGoalProgress";
import { BudgetProgressList } from "../components/BudgetProgressList";
import { useMonthData } from "../hooks/useMonthData";
import { useSettings } from "../hooks/useSettings";
import { useBudgetProgress } from "../hooks/useBudgetProgress";
import type { MonthKey } from "../types";

interface Props {
  month: MonthKey;
  onMonthChange: (m: MonthKey) => void;
}

export function Dashboard({ month, onMonthChange }: Props) {
  const { loading, totalFixed, totalVariable, totalOwed, totalSavings, total, categoryData } = useMonthData(month);
  const { settings } = useSettings();
  const { items: budgetItems } = useBudgetProgress(month);

  return (
    <div className="space-y-4">
      <MonthPicker value={month} onChange={onMonthChange} />
      {loading ? (
        <p className="py-10 text-center text-sm text-slate-400">A carregar…</p>
      ) : (
        <>
          <SummaryCards
            totalFixed={totalFixed}
            totalVariable={totalVariable}
            totalOwed={totalOwed}
            totalSavings={totalSavings}
            total={total}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <UnallocatedBalance
              income={settings.monthlyIncome}
              totalVariable={totalVariable}
              totalFixed={totalFixed}
              totalSavings={totalSavings}
            />
            <SavingsGoalProgress current={totalSavings} goal={settings.monthlySavingsGoal} />
          </div>
          <BudgetProgressList items={budgetItems} />
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-2 font-semibold">Gastos por categoria</h2>
            <CategoryChart data={categoryData} />
          </section>
        </>
      )}
    </div>
  );
}
