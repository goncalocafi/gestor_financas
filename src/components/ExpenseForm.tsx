import { useState, type FormEvent } from "react";
import { CATEGORIES, SAVINGS_CATEGORIES, type AnyCategory, type ExpenseInput } from "../types";

interface Props {
  onSubmit: (input: ExpenseInput, installments: number) => Promise<void>;
}

const today = () => new Date().toISOString().slice(0, 10);

export function ExpenseForm({ onSubmit }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today());
  const [category, setCategory] = useState<AnyCategory>("Alimentação");
  const [isExceptional, setIsExceptional] = useState(false);
  const [installments, setInstallments] = useState(1);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = Number(amount.replace(",", "."));
    if (!description.trim() || !Number.isFinite(value) || value <= 0) return;
    setSaving(true);
    try {
      await onSubmit(
        { description: description.trim(), amount: value, date, category, isExceptional },
        installments
      );
      setDescription("");
      setAmount("");
      setDate(today());
      setIsExceptional(false);
      setInstallments(1);
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <input
        className={`${input} col-span-2`}
        placeholder="Descrição (ex: Supermercado)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        className={input}
        type="text"
        inputMode="decimal"
        placeholder="Valor (€)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input className={input} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      <select className={input} value={category} onChange={(e) => setCategory(e.target.value as AnyCategory)}>
        <optgroup label="Despesas">
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </optgroup>
        <optgroup label="Poupança">
          {SAVINGS_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </optgroup>
      </select>
      <label className="col-span-2 flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={isExceptional} onChange={(e) => setIsExceptional(e.target.checked)} />
        Despesa excecional (ex: viagem grande) — não conta para tendências
      </label>
      {/* Pagamento faseado (ex: Klarna): divide o valor total pelos próximos meses */}
      <select
        className={input}
        value={installments}
        onChange={(e) => setInstallments(Number(e.target.value))}
        aria-label="Prestações"
      >
        <option value={1}>Pagamento único</option>
        {[2, 3, 4, 6, 12].map((n) => (
          <option key={n} value={n}>{n}x (em {n} meses)</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={saving}
        className="col-span-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? "A guardar…" : "Adicionar"}
      </button>
    </form>
  );
}
