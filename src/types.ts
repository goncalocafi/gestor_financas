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

/** Categorias que representam poupança/investimento, não despesa real */
export const SAVINGS_CATEGORIES = ["Poupança", "Investimentos"] as const;
export type SavingsCategory = (typeof SAVINGS_CATEGORIES)[number];

export type AnyCategory = Category | SavingsCategory;

export const isSavingsCategory = (c: AnyCategory): c is SavingsCategory =>
  (SAVINGS_CATEGORIES as readonly string[]).includes(c);

/** Despesa variável (registo do dia a dia) */
export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO "YYYY-MM-DD"
  category: AnyCategory;
  /** Gasto pontual/extraordinário (ex: cruzeiro): não entra nas tendências mensais */
  isExceptional?: boolean;
  createdAt: number;
}

export type ExpenseInput = Omit<Expense, "id" | "createdAt">;

/** Despesa fixa mensal (recorrente) */
export interface FixedExpense {
  id: string;
  description: string;
  amount: number;
  category: AnyCategory;
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

/** Definições do utilizador: rendimento e meta de poupança mensais */
export interface UserSettings {
  monthlyIncome: number;
  monthlySavingsGoal: number;
}

export const DEFAULT_SETTINGS: UserSettings = { monthlyIncome: 0, monthlySavingsGoal: 0 };

/** Limite mensal definido por categoria (metas só fazem sentido para categorias de despesa normal) */
export type BudgetMap = Partial<Record<Category, number>>;

/** Confirmação de que uma despesa fixa foi revista nesse mês (não afeta cálculos) */
export interface FixedConfirmation {
  id: string; // "{month}_{fixedExpenseId}"
  fixedExpenseId: string;
  month: MonthKey;
  confirmedAt: number;
}
