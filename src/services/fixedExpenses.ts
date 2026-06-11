import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { FixedExpense, FixedExpenseInput, MonthKey } from "../types";

// Dados isolados por utilizador: users/{uid}/fixedExpenses/{id}
const fixedCol = (uid: string) => collection(db, "users", uid, "fixedExpenses");

/** Subscreve em tempo real todas as despesas fixas do utilizador. */
export function listenFixedExpenses(
  uid: string,
  onChange: (items: FixedExpense[]) => void
): Unsubscribe {
  const q = query(fixedCol(uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as FixedExpense));
  });
}

export async function addFixedExpense(uid: string, input: FixedExpenseInput): Promise<void> {
  await addDoc(fixedCol(uid), { ...input, createdAt: Date.now() });
}

/** Termina a recorrência: deixa de contar a partir do mês seguinte ao indicado. */
export async function endFixedExpense(uid: string, id: string, lastMonth: MonthKey): Promise<void> {
  await updateDoc(doc(db, "users", uid, "fixedExpenses", id), { endMonth: lastMonth });
}

export async function deleteFixedExpense(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "fixedExpenses", id));
}
