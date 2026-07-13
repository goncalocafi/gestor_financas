import { useState, type FormEvent } from "react";
import { CATEGORIES, SAVINGS_CATEGORIES, currentMonthKey, type AnyCategory, type FixedExpenseInput } from "../types";

interface Props {
  onSubmit: (input: FixedExpenseInput) => Promise<void>;
}

export function FixedExpenseForm({ onSubmit }: Props) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<AnyCategory>("Habitação");
  const [startMonth, setStartMonth] = useState(currentMonthKey());
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = Number(amount.replace(",", "."));
    if (!description.trim() || !Number.isFinite(value) || value <= 0) return;
    setSaving(true);
    try {
      await onSubmit({
        description: description.trim(),
        amount: value,
        category,
        startMonth,
        endMonth: null,
      });
      setDescription("");
      setAmount("");
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <input
        className={`${input} col-span-2`}
        placeholder="Descrição (ex: Renda, Netflix)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        className={input}
        type="text"
        inputMode="decimal"
        placeholder="Valor mensal (€)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
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
      <label className="col-span-2 text-xs text-slate-500">
        Conta a partir de
        <input
          className={`${input} mt-1`}
          type="month"
          value={startMonth}
          onChange={(e) => setStartMonth(e.target.value)}
          required
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="col-span-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        {saving ? "A guardar…" : "Adicionar despesa fixa"}
      </button>
    </form>
  );
}
