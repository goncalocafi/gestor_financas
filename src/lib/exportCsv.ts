import type { Expense, FixedExpense, MonthKey } from "../types";

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/**
 * Gera um CSV (separador ";", compatível com Excel em PT) com as despesas
 * variáveis e fixas do mês, para o utilizador importar noutra ferramenta.
 */
export function exportExpensesCsv(
  month: MonthKey,
  expenses: Expense[],
  fixedInMonth: FixedExpense[]
): void {
  const header = ["Data", "Tipo", "Descrição", "Categoria", "Valor"];
  const rows: string[][] = [];

  for (const e of expenses) {
    rows.push([e.date, "Variável", e.description, e.category, e.amount.toFixed(2).replace(".", ",")]);
  }
  for (const f of fixedInMonth) {
    rows.push([`${month}-01`, "Fixa", f.description, f.category, f.amount.toFixed(2).replace(".", ",")]);
  }
  rows.sort((a, b) => a[0].localeCompare(b[0]));

  const csv = [header, ...rows].map((row) => row.map(escapeCsv).join(";")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `despesas-${month}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
