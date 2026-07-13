import { formatCurrency } from "../types";

interface Props {
  income: number;
  totalVariable: number;
  totalFixed: number;
  totalSavings: number;
}

export function UnallocatedBalance({ income, totalVariable, totalFixed, totalSavings }: Props) {
  if (income <= 0) return null;
  const unallocated = income - totalFixed - totalVariable - totalSavings;
  const positive = unallocated >= 0;

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">Dinheiro por atribuir</p>
      <p className={`mt-1 text-2xl font-semibold ${positive ? "text-emerald-600" : "text-red-600"}`}>
        {formatCurrency(unallocated)}
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Rendimento − despesas fixas e variáveis − poupança deste mês. Ainda não tem destino
        definido, mas conta para a meta de poupança abaixo.
      </p>
    </div>
  );
}
