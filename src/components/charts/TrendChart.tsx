import { LabTrend } from "@/app/types";

type Props = {
  trend: LabTrend;
};

export function TrendChart({ trend }: Props) {
  if (!trend.points.length) return null;

  const width = 360;
  const height = 120;
  const padding = 18;
  const values = trend.points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = trend.points
    .map((point, index) => {
      const x = padding + (index * (width - padding * 2)) / (trend.points.length - 1 || 1);
      const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-xl border bg-white p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
        <p className="font-semibold text-brand-text">{trend.parameterName}</p>
        <p>{trend.unit}</p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full" role="img" aria-label={`Tendencia de ${trend.parameterName}`}>
        <polyline
          fill="none"
          stroke="hsl(var(--brand-secondary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {trend.points.map((point, index) => {
          const x = padding + (index * (width - padding * 2)) / (trend.points.length - 1 || 1);
          const y = height - padding - ((point.value - min) / range) * (height - padding * 2);
          return <circle key={point.date} cx={x} cy={y} r="3" fill="hsl(var(--brand-primary))" />;
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-slate-500">
        <span>{trend.points[0]?.date}</span>
        <span>{trend.points[trend.points.length - 1]?.date}</span>
      </div>
    </div>
  );
}
