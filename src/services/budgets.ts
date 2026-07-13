import { deleteField, doc, onSnapshot, setDoc, type Unsubscribe } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { BudgetMap, Category } from "../types";

// Documento único: users/{uid}/settings/budgets -> { limits: BudgetMap }
const budgetsDoc = (uid: string) => doc(db, "users", uid, "settings", "budgets");

export function listenBudgets(uid: string, onChange: (limits: BudgetMap) => void): Unsubscribe {
  return onSnapshot(budgetsDoc(uid), (snap) => {
    onChange((snap.data()?.limits as BudgetMap | undefined) ?? {});
  });
}

export async function updateBudget(uid: string, category: Category, limit: number): Promise<void> {
  await setDoc(budgetsDoc(uid), { limits: { [category]: limit } }, { merge: true });
}

export async function removeBudget(uid: string, category: Category): Promise<void> {
  await setDoc(budgetsDoc(uid), { limits: { [category]: deleteField() } }, { merge: true });
}
