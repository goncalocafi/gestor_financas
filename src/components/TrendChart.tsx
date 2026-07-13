import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency, type Category } from "../types";
import { COLORS } from "../lib/chartColors";
import type { MonthComparisonRow } from "../hooks/useMonthsComparison";

interface Props {
  rows: MonthComparisonRow[];
  categories: Category[];
}

export function TrendChart({ rows, categories }: Props) {
  if (rows.length === 0 || categories.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-400">Escolhe pelo menos uma categoria.</p>;
  }
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
          {categories.map((c, i) => (
            <Bar key={c} dataKey={c} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
