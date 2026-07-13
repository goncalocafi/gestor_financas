import { useMemo } from "react";
import { useBudgets } from "./useBudgets";
import { useMonthData } from "./useMonthData";
import type { Category, MonthKey } from "../types";

export interface BudgetProgress {
  category: Category;
  spent: number;
  limit: number;
  percent: number;
}

export function useBudgetProgress(month: MonthKey) {
  const { loading: loadingBudgets, limits } = useBudgets();
  const { loading: loadingMonth, categoryData } = useMonthData(month);

  const items = useMemo<BudgetProgress[]>(() => {
    const spentByCategory = new Map(categoryData.map((c) => [c.name, c.value]));
    return (Object.entries(limits) as [Category, number][])
      .filter(([, limit]) => limit > 0)
      .map(([category, limit]) => {
        const spent = spentByCategory.get(category) ?? 0;
        return { category, spent, limit, percent: limit > 0 ? spent / limit : 0 };
      })
      .sort((a, b) => b.percent - a.percent);
  }, [limits, categoryData]);

  return { loading: loadingBudgets || loadingMonth, items };
}
