import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Debt, DebtInput, DebtPayment, MonthKey } from "../types";

// Dados isolados por utilizador: users/{uid}/debts/{id}
const debtsCol = (uid: string) => collection(db, "users", uid, "debts");

/** Subscreve em tempo real os empréstimos feitos num mês ("YYYY-MM"). */
export function listenDebtsByMonth(
  uid: string,
  month: MonthKey,
  onChange: (debts: Debt[]) => void
): Unsubscribe {
  const q = query(
    debtsCol(uid),
    where("date", ">=", `${month}-01`),
    where("date", "<=", `${month}-31`),
    orderBy("date", "desc")
  );
  return onSnapshot(q, (snap) => {
    // payments ?? [] cobre documentos criados antes do histórico de abates existir
    onChange(
      snap.docs.map((d) => {
        const data = d.data() as Omit<Debt, "id">;
        return { ...data, id: d.id, payments: data.payments ?? [] };
      })
    );
  });
}

export async function addDebt(uid: string, input: DebtInput): Promise<void> {
  await addDoc(debtsCol(uid), { ...input, paidAmount: 0, payments: [], createdAt: Date.now() });
}

/** Abate um pagamento recebido ao valor em dívida e guarda-o no histórico. */
export async function registerPayment(uid: string, id: string, payment: DebtPayment): Promise<void> {
  await updateDoc(doc(db, "users", uid, "debts", id), {
    paidAmount: increment(payment.amount),
    payments: arrayUnion(payment),
  });
}

export async function deleteDebt(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "debts", id));
}

/** Soma `months` meses a uma data ISO, ajustando o dia se o mês for mais curto. */
function addMonths(isoDate: string, months: number): string {
  const [y, m, day] = isoDate.split("-").map(Number);
  const lastDay = new Date(y, m - 1 + months + 1, 0).getDate();
  const d = new Date(y, m - 1 + months, Math.min(day, lastDay));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Empréstimo pago em prestações (ex: comprei via Klarna em 3 meses para
 * outra pessoa): divide o total em partes iguais e cria um registo em cada
 * mês consecutivo. Diferenças de cêntimos vão para a última prestação.
 */
export async function addDebtInstallments(
  uid: string,
  input: DebtInput,
  installments: number
): Promise<void> {
  const batch = writeBatch(db);
  const perMonth = Math.floor((input.amount / installments) * 100) / 100;
  const lastAmount = Math.round((input.amount - perMonth * (installments - 1)) * 100) / 100;
  const now = Date.now();

  for (let i = 0; i < installments; i++) {
    batch.set(doc(debtsCol(uid)), {
      ...input,
      description: `${input.description} (${i + 1}/${installments})`,
      amount: i === installments - 1 ? lastAmount : perMonth,
      date: addMonths(input.date, i),
      paidAmount: 0,
      payments: [],
      createdAt: now,
    });
  }
  await batch.commit();
}
