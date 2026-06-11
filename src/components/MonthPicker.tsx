import { monthKey, type MonthKey } from "../types";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

interface Props {
  value: MonthKey;
  onChange: (month: MonthKey) => void;
}

export function MonthPicker({ value, onChange }: Props) {
  const [year, month] = value.split("-").map(Number);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i);

  const shift = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1);
    onChange(monthKey(d.getFullYear(), d.getMonth() + 1));
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => shift(-1)}
        aria-label="Mês anterior"
        className="rounded-lg bg-white px-3 py-2 shadow-sm hover:bg-slate-50 active:scale-95"
      >
        ‹
      </button>
      <select
        value={month}
        onChange={(e) => onChange(monthKey(year, Number(e.target.value)))}
        className="flex-1 rounded-lg bg-white px-3 py-2 shadow-sm"
      >
        {MONTHS.map((name, i) => (
          <option key={name} value={i + 1}>{name}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => onChange(monthKey(Number(e.target.value), month))}
        className="rounded-lg bg-white px-3 py-2 shadow-sm"
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <button
        onClick={() => shift(1)}
        aria-label="Mês seguinte"
        className="rounded-lg bg-white px-3 py-2 shadow-sm hover:bg-slate-50 active:scale-95"
      >
        ›
      </button>
    </div>
  );
}
