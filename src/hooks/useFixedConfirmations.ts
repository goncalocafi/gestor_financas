import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { confirmFixedExpense, listenFixedConfirmations, unconfirmFixedExpense } from "../services/fixedConfirmations";
import type { MonthKey } from "../types";

export function useFixedConfirmations(month: MonthKey) {
  const { user } = useAuth();
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    return listenFixedConfirmations(user.uid, month, (ids) => {
      setConfirmedIds(ids);
      setLoading(false);
    });
  }, [user, month]);

  const toggle = (fixedExpenseId: string, confirmed: boolean) => {
    if (!user) return Promise.resolve();
    return confirmed
      ? confirmFixedExpense(user.uid, month, fixedExpenseId)
      : unconfirmFixedExpense(user.uid, month, fixedExpenseId);
  };

  return { loading, confirmedIds, toggle };
}
