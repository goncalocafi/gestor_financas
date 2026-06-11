import { MonthPicker } from "../components/MonthPicker";
import { SummaryCards } from "../components/SummaryCards";
import { CategoryChart } from "../components/CategoryChart";
import { useMonthData } from "../hooks/useMonthData";
import type { MonthKey } from "../types";

interface Props {
  month: MonthKey;
  onMonthChange: (m: MonthKey) => void;
}

export function Dashboard({ month, onMonthChange }: Props) {
  const { loading, totalFixed, totalVariable, totalOwed, total, categoryData } = useMonthData(month);

  return (
    <div className="space-y-4">
      <MonthPicker value={month} onChange={onMonthChange} />
      {loading ? (
        <p className="py-10 text-center text-sm text-slate-400">A carregar…</p>
      ) : (
        <>
          <SummaryCards totalFixed={totalFixed} totalVariable={totalVariable} totalOwed={totalOwed} total={total} />
          <section className="rounded-2xl bg-white p-4 shadow-sm">
            <h2 className="mb-2 font-semibold">Gastos por categoria</h2>
            <CategoryChart data={categoryData} />
          </section>
        </>
      )}
    </div>
  );
}
