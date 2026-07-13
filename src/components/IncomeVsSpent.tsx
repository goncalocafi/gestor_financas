import { ProgressBar } from "./ProgressBar";
import { formatCurrency } from "../types";

interface Props {
  income: number;
  spent: number; // despesas fixas + variáveis + poupança/investimento
}

export function IncomeVsSpent({ income, spent }: Props) {
  if (income <= 0) return null;
  const remaining = income - spent;
  const positive = remaining >= 0;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <ProgressBar value={spent} max={income} label="Gasto este mês" />
      <p className={`mt-2 text-sm font-medium ${positive ? "text-emerald-600" : "text-red-600"}`}>
        {positive ? `Sobram ${formatCurrency(remaining)}` : `Ultrapassaste em ${formatCurrency(-remaining)}`}
      </p>
    </div>
  );
}
