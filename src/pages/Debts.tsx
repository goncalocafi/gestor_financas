import { useState, type FormEvent } from "react";
import { MonthPicker } from "../components/MonthPicker";
import { useAuth } from "../hooks/useAuth";
import { useMonthData } from "../hooks/useMonthData";
import { addDebt, addDebtInstallments, deleteDebt, registerPayment } from "../services/debts";
import { debtOutstanding, formatCurrency, type Debt, type DebtPayment, type MonthKey } from "../types";

interface Props {
  month: MonthKey;
  onMonthChange: (m: MonthKey) => void;
}

const today = () => new Date().toISOString().slice(0, 10);
const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none";

function DebtItem({
  debt,
  onPay,
  onDelete,
}: {
  debt: Debt;
  onPay: (p: DebtPayment) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [payerName, setPayerName] = useState("");
  const [payment, setPayment] = useState("");
  const outstanding = debtOutstanding(debt);
  const paid = outstanding === 0;

  const handlePay = (e: FormEvent) => {
    e.preventDefault();
    const value = Number(payment.replace(",", "."));
    if (!payerName.trim() || !Number.isFinite(value) || value <= 0) return;
    onPay({
      name: payerName.trim(),
      amount: Math.min(value, outstanding),
      date: today(),
      createdAt: Date.now(),
    });
    setPayerName("");
    setPayment("");
  };

  return (
    <li>
      {/* Cabeçalho clicável: expande para mostrar o histórico de abates */}
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 p-4 text-left">
        <div className="min-w-0 flex-1">
          <p className={`truncate font-medium ${paid ? "text-slate-400 line-through" : ""}`}>{debt.description}</p>
          <p className="text-xs text-slate-500">
            {new Date(debt.date + "T00:00").toLocaleDateString("pt-PT")} · emprestei {formatCurrency(debt.amount)}
            {debt.paidAmount > 0 && ` · já recebi ${formatCurrency(Math.min(debt.paidAmount, debt.amount))}`}
          </p>
        </div>
        <span className={`font-semibold ${paid ? "text-emerald-600" : ""}`}>
          {paid ? "Pago ✓" : formatCurrency(outstanding)}
        </span>
        <span className={`text-slate-400 transition-transform ${open ? "rotate-90" : ""}`}>›</span>
      </button>

      {open && (
        <div className="space-y-3 px-4 pb-4">
          {debt.payments.length > 0 ? (
            <ul className="space-y-1 rounded-xl bg-slate-50 p-3">
              {[...debt.payments]
                .sort((a, b) => b.createdAt - a.createdAt)
                .map((p) => (
                  <li key={p.createdAt} className="flex items-center justify-between text-sm">
                    <span>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-slate-500">
                        {" "}· {new Date(p.date + "T00:00").toLocaleDateString("pt-PT")}
                      </span>
                    </span>
                    <span className="font-semibold text-emerald-600">−{formatCurrency(p.amount)}</span>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Ainda não houve abates.</p>
          )}

          {!paid && (
            <form onSubmit={handlePay} className="flex flex-wrap gap-2">
              <input
                className={`${inputCls} min-w-32 flex-1`}
                placeholder="Quem pagou"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                required
              />
              <input
                className={`${inputCls} w-28 flex-none`}
                type="text"
                inputMode="decimal"
                placeholder="€"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                required
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Abater
              </button>
            </form>
          )}

          <button
            onClick={() => {
              if (window.confirm(`Apagar o empréstimo "${debt.description}"? Esta ação não pode ser anulada.`)) {
                onDelete();
              }
            }}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            🗑 Apagar empréstimo
          </button>
        </div>
      )}
    </li>
  );
}

export function Debts({ month, onMonthChange }: Props) {
  const { user } = useAuth();
  const { debts } = useMonthData(month);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today());
  const [installments, setInstallments] = useState(1);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = Number(amount.replace(",", "."));
    if (!description.trim() || !Number.isFinite(value) || value <= 0) return;
    setSaving(true);
    try {
      const input = { description: description.trim(), amount: value, date };
      if (installments > 1) {
        await addDebtInstallments(user.uid, input, installments);
      } else {
        await addDebt(user.uid, input);
      }
      setDescription("");
      setAmount("");
      setDate(today());
      setInstallments(1);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <MonthPicker value={month} onChange={onMonthChange} />
      <p className="text-sm text-slate-500">
        O valor ainda em dívida conta para o total do mês em que emprestaste; ao abateres os
        pagamentos recebidos, o total desce automaticamente.
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <input
          className={`${inputCls} col-span-2`}
          placeholder="A quem / porquê (ex: Jantar do João)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          className={inputCls}
          type="text"
          inputMode="decimal"
          placeholder="Valor emprestado (€)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input className={inputCls} type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        {/* Compra faseada (ex: Klarna): divide o valor pelos próximos meses */}
        <select
          className={`${inputCls} col-span-2`}
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
          {saving ? "A guardar…" : "Registar empréstimo"}
        </button>
      </form>
      {debts.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">Ninguém te deve nada neste mês. 🎉</p>
      ) : (
        <ul className="divide-y divide-slate-100 rounded-2xl bg-white shadow-sm">
          {debts.map((d) => (
            <DebtItem
              key={d.id}
              debt={d}
              onPay={(p) => registerPayment(user.uid, d.id, p)}
              onDelete={() => deleteDebt(user.uid, d.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
