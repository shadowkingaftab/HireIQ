import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
} from "recharts";

/* Themed Recharts wrappers. All colors resolve from CSS variables so charts
 * track dark/light automatically. Every chart must answer a question — the
 * caller supplies `question` for the accessible label and caption. */

const axisStyle = { fontSize: 11, fill: "hsl(var(--ph-ink-faint))" };

const tooltipContent = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-line-strong bg-surface-2/95 px-3 py-2 shadow-overlay backdrop-blur-sm">
      <p className="numeric mb-1 font-mono text-micro text-ink-faint">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="numeric flex items-center gap-2 font-mono text-meta text-ink-hi">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: entry.color || entry.stroke }} />
          <span className="text-ink-muted">{entry.name}:</span> {typeof entry.value === "number" ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
};

export function TrendAreaChart({ data, series, xKey = "week", question, height = 220, className = "" }) {
  return (
    <figure
      className={className}
      role="img"
      aria-label={question}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            {series.map((s) => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={`hsl(var(--ph-${s.tone || "intel"}) / 0.28)`} />
                <stop offset="100%" stopColor={`hsl(var(--ph-${s.tone || "intel"}) / 0.02)`} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid stroke="hsl(var(--ph-line-subtle))" strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} dy={6} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={44} />
          <RTooltip content={(p) => tooltipContent(p)} cursor={{ stroke: "hsl(var(--ph-line-strong))", strokeDasharray: "4 4" }} />
          {series.map((s) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={`hsl(var(--ph-${s.tone || "intel"}))`}
              strokeWidth={1.8}
              fill={`url(#grad-${s.key})`}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
      <figcaption className="mt-2 text-micro text-ink-faint">{question}</figcaption>
    </figure>
  );
}

export function DistributionBarChart({ data, xKey, yKey = "count", tone = "intel", question, height = 200, className = "" }) {
  return (
    <figure className={className} role="img" aria-label={question}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} barCategoryGap="28%">
          <CartesianGrid stroke="hsl(var(--ph-line-subtle))" strokeDasharray="3 6" vertical={false} />
          <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} dy={6} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={44} />
          <RTooltip content={(p) => tooltipContent(p)} cursor={{ fill: "hsl(var(--ph-surface-2) / 0.5)" }} />
          <Bar dataKey={yKey} radius={[4, 4, 0, 0]} fill={`hsl(var(--ph-${tone}))`} maxBarSize={38} />
        </BarChart>
      </ResponsiveContainer>
      <figcaption className="mt-2 text-micro text-ink-faint">{question}</figcaption>
    </figure>
  );
}

/** Horizontal demand-vs-supply comparison. */
export function CompareBars({ data, labelKey = "skill", aKey = "demand", bKey = "supply", question, className = "" }) {
  const max = Math.max(...data.map((d) => Math.max(d[aKey], d[bKey])), 1);
  return (
    <figure className={className} role="img" aria-label={question}>
      <ul role="list" className="flex flex-col gap-3">
        {data.map((row) => (
          <li key={row[labelKey]}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-body-sm text-ink-hi">{row[labelKey]}</span>
              <span className="numeric font-mono text-micro text-ink-faint">
                {row[aKey]} vs {row[bKey]}
              </span>
            </div>
            <div className="flex flex-col gap-1" aria-hidden="true">
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full rounded-full bg-intel transition-[width] duration-500" style={{ width: `${(row[aKey] / max) * 100}%` }} />
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
                <div className="h-full rounded-full bg-verified/70 transition-[width] duration-500" style={{ width: `${(row[bKey] / max) * 100}%` }} />
              </div>
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 flex items-center gap-4 text-micro text-ink-faint">
        <span className="flex items-center gap-1.5"><span aria-hidden="true" className="h-1.5 w-4 rounded-full bg-intel" /> demand</span>
        <span className="flex items-center gap-1.5"><span aria-hidden="true" className="h-1.5 w-4 rounded-full bg-verified/70" /> candidate supply</span>
        — {question}
      </figcaption>
    </figure>
  );
}
