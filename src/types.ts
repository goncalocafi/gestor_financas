export const CATEGORIES = [
  "Alimentação",
  "Habitação",
  "Transportes",
  "Saúde",
  "Lazer",
  "Subscrições",
  "Educação",
  "Compras",
  "Desporto",
  "Apostas",
  "Prendas",
  "Férias",
  "Saídas à noite",
  "Outros",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Despesa variável (registo do dia a dia) */
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO "YYYY-MM-DD"
  category: Category;
  createdAt: number;
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt">;

/** Despesa fixa mensal (recorrente) */
export interface FixedExpense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  /** Primeiro mês em que a despesa conta, formato "YYYY-MM" */
  startMonth: string;
  /** Último mês (inclusive) em que conta; null = ainda ativa */
  endMonth: string | null;
  createdAt: number;
}

export type FixedExpenseInput = Omit<FixedExpense, "id" | "createdAt">;

/** Um pagamento parcial (abate) recebido de um empréstimo */
export interface DebtPayment {
  name: string; // quem pagou
  amount: number;
  date: string; // ISO "YYYY-MM-DD"
  createdAt: number;
}

/** Dinheiro emprestado que ainda me devem */
export interface Debt {
  id: string;
  description: string;
  amount: number; // valor total emprestado
  paidAmount: number; // soma do que já me pagaram de volta
  payments: DebtPayment[]; // histórico de abates
  date: string; // ISO "YYYY-MM-DD" — dia em que emprestei
  createdAt: number;
}

export type DebtInput = Omit<Debt, "id" | "paidAmount" | "payments" | "createdAt">;

/** O que ainda falta receber */
export const debtOutstanding = (d: Debt): number => Math.max(0, d.amount - d.paidAmount);

/** "YYYY-MM" do mês selecionado */
export type MonthKey = string;

export const monthKey = (year: number, month: number): MonthKey =>
  `${year}-${String(month).padStart(2, "0")}`;

export const currentMonthKey = (): MonthKey => {
  const now = new Date();
  return monthKey(now.getFullYear(), now.getMonth() + 1);
};

/** Uma despesa fixa está ativa num mês se startMonth <= mês <= endMonth */
export const isFixedActiveInMonth = (f: FixedExpense, month: MonthKey): boolean =>
  f.startMonth <= month && (f.endMonth === null || month <= f.endMonth);

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value);
