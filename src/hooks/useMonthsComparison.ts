import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import { listenExpensesByMonth } from "../services/expenses";
import { listenFixedExpenses } from "../services/fixedExpenses";
import { isFixedActiveInMonth, isSavingsCategory, type Category, type Expense, type FixedExpense, type MonthKey } from "../types";

export interface MonthComparisonRow {
  month: MonthKey;
  total: number;
  [category: string]: number | string;
}

/** Agrega despesas (variáveis + fixas) de vários meses, uma linha por mês, uma coluna por categoria. */
export function useMonthsComparison(months: MonthKey[], excludeExceptional = true) {
  const { user } = useAuth();
  const [expensesByMonth, setExpensesByMonth] = useState<Map<MonthKey, Expense[]>>(new Map());
  const [allFixed, setAllFixed] = useState<FixedExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    let pending = months.length + 1;
    const done = () => {
      pending -= 1;
      if (pending <= 0) setLoading(false);
    };

    const unsubs = months.map((month) =>
      listenExpensesByMonth(user.uid, month, (items) => {
        setExpensesByMonth((prev) => new Map(prev).set(month, items));
        done();
      })
    );
    const unsubFixed = listenFixedExpenses(user.uid, (items) => {
      setAllFixed(items);
      done();
    });

    return () => {
      unsubs.forEach((u) => u());
      unsubFixed();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, months.join(",")]);

  const rows = useMemo<MonthComparisonRow[]>(() => {
    return months.map((month) => {
      const expenses = (expensesByMonth.get(month) ?? []).filter(
        (e) => !isSavingsCategory(e.category) && !(excludeExceptional && e.isExceptional)
      );
      const fixedInMonth = allFixed.filter((f) => isFixedActiveInMonth(f, month) && !isSavingsCategory(f.category));

      const row: MonthComparisonRow = { month, total: 0 };
      for (const e of expenses) {
        const cat = e.category as Category;
        row[cat] = ((row[cat] as number) ?? 0) + e.amount;
        row.total += e.amount;
      }
      for (const f of fixedInMonth) {
        const cat = f.category as Category;
        row[cat] = ((row[cat] as number) ?? 0) + f.amount;
        row.total += f.amount;
      }
      return row;
    });
  }, [months, expensesByMonth, allFixed, excludeExceptional]);

  return { loading, rows };
}
