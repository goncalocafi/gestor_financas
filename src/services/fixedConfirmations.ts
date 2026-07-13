import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where, type Unsubscribe } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { MonthKey } from "../types";

// Coleção: users/{uid}/fixedConfirmations/{month}_{fixedExpenseId}
const confirmationsCol = (uid: string) => collection(db, "users", uid, "fixedConfirmations");
const confirmationId = (month: MonthKey, fixedExpenseId: string) => `${month}_${fixedExpenseId}`;

export function listenFixedConfirmations(
  uid: string,
  month: MonthKey,
  onChange: (ids: Set<string>) => void
): Unsubscribe {
  const q = query(confirmationsCol(uid), where("month", "==", month));
  return onSnapshot(q, (snap) => {
    onChange(new Set(snap.docs.map((d) => d.data().fixedExpenseId as string)));
  });
}

export async function confirmFixedExpense(uid: string, month: MonthKey, fixedExpenseId: string): Promise<void> {
  await setDoc(doc(confirmationsCol(uid), confirmationId(month, fixedExpenseId)), {
    fixedExpenseId,
    month,
    confirmedAt: Date.now(),
  });
}

export async function unconfirmFixedExpense(uid: string, month: MonthKey, fixedExpenseId: string): Promise<void> {
  await deleteDoc(doc(confirmationsCol(uid), confirmationId(month, fixedExpenseId)));
}
