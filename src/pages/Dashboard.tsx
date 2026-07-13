import { MonthPicker } from "../components/MonthPicker";
import { SummaryCards } from "../components/SummaryCards";
import { CategoryChart } from "../components/CategoryChart";
import { IncomeVsSpent } from "../components/IncomeVsSpent";
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
            <IncomeVsSpent income={settings.monthlyIncome} spent={totalFixed + totalVariable + totalSavings} />
            <SavingsGoalProgress
              current={totalSavings + Math.max(0, settings.monthlyIncome - totalFixed - totalVariable - totalSavings)}
              goal={settings.monthlySavingsGoal}
            />
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
