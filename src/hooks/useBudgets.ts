import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { listenBudgets, removeBudget, updateBudget } from "../services/budgets";
import type { BudgetMap, Category } from "../types";

export function useBudgets() {
  const { user } = useAuth();
  const [limits, setLimits] = useState<BudgetMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    return listenBudgets(user.uid, (l) => {
      setLimits(l);
      setLoading(false);
    });
  }, [user]);

  return {
    loading,
    limits,
    updateBudget: (category: Category, limit: number) => (user ? updateBudget(user.uid, category, limit) : Promise.resolve()),
    removeBudget: (category: Category) => (user ? removeBudget(user.uid, category) : Promise.resolve()),
  };
}
