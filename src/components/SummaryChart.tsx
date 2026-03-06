import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts";
import type { Summary } from "@/types/api";
import { formatCurrencyFromReal } from "@/lib/formatters";
import { maskValue } from "@/contexts/HideValuesContext";

const monthLabels: Record<string, string> = {
  "01": "Jan",
  "02": "Fev",
  "03": "Mar",
  "04": "Abr",
  "05": "Mai",
  "06": "Jun",
  "07": "Jul",
  "08": "Ago",
  "09": "Set",
  "10": "Out",
  "11": "Nov",
  "12": "Dez",
};

function formatMonth(monthStr: string) {
  const [, m, y] = monthStr.split("-");
  const yearShort = y ? y.slice(-2) : "";
  return `${monthLabels[m ?? "01"] ?? m}/${yearShort}`;
}

interface ChartPoint {
  month: string;
  monthLabel: string;
  pnl: number;
}

function buildChartData(summaries: Summary[]): ChartPoint[] {
  const sorted = [...summaries].sort((a, b) => a.month.localeCompare(b.month));

  return sorted.map((s) => {
    return {
      month: s.month,
      monthLabel: formatMonth(s.month),
      pnl: s.pnl_brl / 100,
    };
  });
}

function CustomTooltip({
  active,
  payload,
  hideValues = false,
}: TooltipProps<number, string> & { hideValues?: boolean }) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload as ChartPoint | undefined;
  if (!point) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
      <p className="mb-2 font-medium text-slate-800">{point.monthLabel}</p>
      <div className="flex flex-col gap-1 text-sm">
        <span className="text-slate-600">
          PnL:{" "}
          <span
            className={
              point.pnl >= 0 ? "text-emerald-600" : "text-red-600"
            }
          >
            {maskValue(formatCurrencyFromReal(point.pnl), hideValues)}
          </span>
        </span>
        <span className="text-slate-600">
          Apenas PnL do mês
        </span>
      </div>
    </div>
  );
}

interface SummaryChartProps {
  summaries: Summary[];
  hideValues?: boolean;
}

export function SummaryChart({ summaries, hideValues = false }: SummaryChartProps) {
  const data = buildChartData(summaries);

  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-slate-500">
        Sem dados para exibir
      </p>
    );
  }

  const tickFormatter = (v: number) =>
    hideValues ? "•••" : `${(v / 1000).toFixed(0)}k`;

  return (
    <ResponsiveContainer width="100%" height={360}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="monthLabel"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#94a3b8" }}
        />
        <YAxis
          yAxisId="pnl"
          orientation="left"
          tickFormatter={tickFormatter}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={{ stroke: "#94a3b8" }}
        />
        <Tooltip content={<CustomTooltip hideValues={hideValues} />} />
        <Bar
          yAxisId="pnl"
          dataKey="pnl"
          name="PnL do mês"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          fillOpacity={0.8}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
