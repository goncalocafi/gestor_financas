import { ProgressBar } from "./ProgressBar";

interface Props {
  current: number;
  goal: number;
}

export function SavingsGoalProgress({ current, goal }: Props) {
  if (goal <= 0) return null;
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <ProgressBar value={current} max={goal} label="Meta de poupança do mês" invert />
    </div>
  );
}
