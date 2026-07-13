import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./useAuth";
import { listenExpensesByMonth } from "../services/expenses";
import { listenFixedExpenses } from "../services/fixedExpenses";
import { listenDebtsByMonth } from "../services/debts";
import {
  debtOutstanding,
  isFixedActiveInMonth,
  isSavingsCategory,
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

    const spendExpenses = expenses.filter((e) => !isSavingsCategory(e.category));
    const savingsExpenses = expenses.filter((e) => isSavingsCategory(e.category));
    const spendFixed = fixedInMonth.filter((f) => !isSavingsCategory(f.category));
    const savingsFixed = fixedInMonth.filter((f) => isSavingsCategory(f.category));

    const totalFixed = spendFixed.reduce((sum, f) => sum + f.amount, 0);
    const totalVariable = spendExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalOwed = debts.reduce((sum, d) => sum + debtOutstanding(d), 0);
    const totalSavings =
      savingsExpenses.reduce((sum, e) => sum + e.amount, 0) + savingsFixed.reduce((sum, f) => sum + f.amount, 0);
    const totalExcludingExceptional =
      totalFixed +
      spendExpenses.filter((e) => !e.isExceptional).reduce((sum, e) => sum + e.amount, 0) +
      totalOwed;

    const byCategory = new Map<Category | "Empréstimos", number>();
    for (const e of spendExpenses)
      byCategory.set(e.category as Category, (byCategory.get(e.category as Category) ?? 0) + e.amount);
    for (const f of spendFixed)
      byCategory.set(f.category as Category, (byCategory.get(f.category as Category) ?? 0) + f.amount);
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
      totalSavings,
      totalExcludingExceptional,
      total: totalFixed + totalVariable + totalOwed,
      categoryData: [...byCategory.entries()]
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value),
    };
  }, [expenses, allFixed, debts, month, loading]);
}
