import { formatCurrency } from "../types";

interface Props {
  totalFixed: number;
  totalVariable: number;
  totalOwed: number;
  total: number;
}

export function SummaryCards({ totalFixed, totalVariable, totalOwed, total }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Despesas Fixas</p>
        <p className="mt-1 text-2xl font-semibold text-indigo-600">{formatCurrency(totalFixed)}</p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Despesas Variáveis</p>
        <p className="mt-1 text-2xl font-semibold text-amber-600">{formatCurrency(totalVariable)}</p>
      </div>
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Devem-me</p>
        <p className="mt-1 text-2xl font-semibold text-emerald-600">{formatCurrency(totalOwed)}</p>
      </div>
      <div className="rounded-2xl bg-slate-900 p-4 shadow-sm">
        <p className="text-sm text-slate-300">Total Geral</p>
        <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(total)}</p>
      </div>
    </div>
  );
}
