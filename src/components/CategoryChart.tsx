import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "../types";

const COLORS = [
  "#4f46e5", "#f59e0b", "#10b981", "#ef4444", "#06b6d4",
  "#8b5cf6", "#ec4899", "#84cc16", "#0ea5e9", "#64748b",
];

interface Props {
  data: { name: string; value: number }[];
}

export function CategoryChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-slate-400">
        Sem despesas neste período.
      </p>
    );
  }
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
