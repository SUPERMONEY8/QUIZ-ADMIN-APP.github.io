// Props:
// - current: number (1-based index of current question)
// - total: number (total questions)
// - pointsEarned: number
// - totalPoints: number
// - className?: string
export default function ProgressBar({ current = 1, total = 1, pointsEarned = 0, totalPoints = 0, className = "" }) {
  const safeTotal = Math.max(1, Number(total) || 1);
  const safeCurrent = Math.min(Math.max(1, Number(current) || 1), safeTotal);
  const percent = Math.round(((safeCurrent - 1) / safeTotal) * 100);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between text-sm text-gray-700">
        <div>
          Question {safeCurrent} of {safeTotal}
        </div>
        <div className="hidden sm:block">
          {pointsEarned} / {totalPoints} pts
        </div>
      </div>
      <div className="mt-2 h-3 w-full rounded-full bg-gray-200 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <div
          className="h-full bg-indigo-600 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="sm:hidden mt-2 text-xs text-gray-600">
        {pointsEarned} / {totalPoints} pts
      </div>
    </div>
  );
}


