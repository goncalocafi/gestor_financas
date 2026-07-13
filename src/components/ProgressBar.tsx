import { formatCurrency } from "../types";

interface Props {
  value: number;
  max: number;
  label?: string;
  formatValue?: (n: number) => string;
  /** Quando true, atingir/ultrapassar o max é bom (ex: meta de poupança) em vez de mau (ex: limite de gasto) */
  invert?: boolean;
}

export function ProgressBar({ value, max, label, formatValue = formatCurrency, invert = false }: Props) {
  const ratio = max > 0 ? value / max : 0;
  const percent = Math.min(100, Math.round(ratio * 100));
  const barColor = invert
    ? ratio >= 1
      ? "bg-emerald-500"
      : ratio >= 0.5
        ? "bg-amber-500"
        : "bg-red-500"
    : ratio < 0.75
      ? "bg-emerald-500"
      : ratio < 1
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-sm">
          <span className="font-medium">{label}</span>
          <span className="text-slate-500">
            {formatValue(value)} / {formatValue(max)}
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
