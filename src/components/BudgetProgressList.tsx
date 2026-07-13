import { ProgressBar } from "./ProgressBar";
import type { BudgetProgress } from "../hooks/useBudgetProgress";

interface Props {
  items: BudgetProgress[];
}

export function BudgetProgressList({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm">
      <h2 className="font-semibold">Metas por categoria</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <ProgressBar key={item.category} value={item.spent} max={item.limit} label={item.category} />
        ))}
      </div>
    </section>
  );
}
