import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { AnyCategory, Expense, ExpenseInput, MonthKey } from "../types";

// Dados isolados por utilizador: users/{uid}/expenses/{id}
const expensesCol = (uid: string) => collection(db, "users", uid, "expenses");

/** Subscreve em tempo real as despesas variáveis de um mês ("YYYY-MM"). */
export function listenExpensesByMonth(
  uid: string,
  month: MonthKey,
  onChange: (expenses: Expense[]) => void
): Unsubscribe {
  const q = query(
    expensesCol(uid),
    where("date", ">=", `${month}-01`),
    where("date", "<=", `${month}-31`),
    orderBy("date", "desc")
  );
  return onSnapshot(q, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Expense));
  });
}

export async function addExpense(uid: string, input: ExpenseInput): Promise<void> {
  await addDoc(expensesCol(uid), { ...input, createdAt: Date.now() });
}

export async function deleteExpense(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "expenses", id));
}

export async function updateExpenseCategory(uid: string, id: string, category: AnyCategory): Promise<void> {
  await updateDoc(doc(db, "users", uid, "expenses", id), { category });
}

export async function updateExpenseExceptional(uid: string, id: string, isExceptional: boolean): Promise<void> {
  await updateDoc(doc(db, "users", uid, "expenses", id), { isExceptional });
}

/** Soma `months` meses a uma data ISO, ajustando o dia se o mês for mais curto. */
function addMonths(isoDate: string, months: number): string {
  const [y, m, day] = isoDate.split("-").map(Number);
  const lastDay = new Date(y, m - 1 + months + 1, 0).getDate();
  const d = new Date(y, m - 1 + months, Math.min(day, lastDay));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Pagamento em prestações (ex: Klarna em 3 meses): divide o valor total em
 * partes iguais e cria uma despesa em cada mês consecutivo a partir da data
 * indicada. Diferenças de cêntimos vão para a última prestação.
 */
export async function addExpenseInstallments(
  uid: string,
  input: ExpenseInput,
  installments: number
): Promise<void> {
  const batch = writeBatch(db);
  const perMonth = Math.floor((input.amount / installments) * 100) / 100;
  const lastAmount = Math.round((input.amount - perMonth * (installments - 1)) * 100) / 100;
  const now = Date.now();

  for (let i = 0; i < installments; i++) {
    batch.set(doc(expensesCol(uid)), {
      ...input,
      description: `${input.description} (${i + 1}/${installments})`,
      amount: i === installments - 1 ? lastAmount : perMonth,
      date: addMonths(input.date, i),
      createdAt: now,
    });
  }
  await batch.commit();
}
