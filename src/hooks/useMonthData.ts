import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import { listenExpensesByMonth } from "../services/expenses";
import { listenFixedExpenses } from "../services/fixedExpenses";
import { listenDebtsByMonth } from "../services/debts";
import {
  debtOutstanding,
  isFixedActiveInMonth,
  type Category,
  type Debt,
  type Expense,
  type FixedExpense,
  type MonthKey,
} from "../types";

/**
 * Junta, para o mês selecionado, as despesas variáveis registadas e as
 * despesas fixas ativas, e calcula os totais e a distribuição por categoria.
 */
export function useMonthData(month: MonthKey) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [allFixed, setAllFixed] = useState<FixedExpense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    let pending = 3;
    const done = () => {
      pending -= 1;
      if (pending <= 0) setLoading(false);
    };
    const unsubExpenses = listenExpensesByMonth(user.uid, month, (items) => {
      setExpenses(items);
      done();
    });
    const unsubFixed = listenFixedExpenses(user.uid, (items) => {
      setAllFixed(items);
      done();
    });
    const unsubDebts = listenDebtsByMonth(user.uid, month, (items) => {
      setDebts(items);
      done();
    });
    return () => {
      unsubExpenses();
      unsubFixed();
      unsubDebts();
    };
  }, [user, month]);

  return useMemo(() => {
    const fixedInMonth = allFixed.filter((f) => isFixedActiveInMonth(f, month));
    const totalFixed = fixedInMonth.reduce((sum, f) => sum + f.amount, 0);
    const totalVariable = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalOwed = debts.reduce((sum, d) => sum + debtOutstanding(d), 0);

    const byCategory = new Map<Category | "Empréstimos", number>();
    for (const e of expenses) byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount);
    for (const f of fixedInMonth) byCategory.set(f.category, (byCategory.get(f.category) ?? 0) + f.amount);
    if (totalOwed > 0) byCategory.set("Empréstimos", totalOwed);

    return {
      loading,
      expenses,
      allFixed,
      fixedInMonth,
      debts,
      totalFixed,
      totalVariable,
      totalOwed,
      total: totalFixed + totalVariable + totalOwed,
      categoryData: [...byCategory.entries()]
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
    };
  }, [expenses, allFixed, debts, month, loading]);
}
